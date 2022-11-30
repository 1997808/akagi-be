import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChannelsService } from './channels.service';
import { Socket, Server } from 'socket.io';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthService } from '../auth/auth.service';
import { throwErr, wsError } from '../utils/exception';
import {
  DisplayMediaDto,
  JoinActiveChannelDto,
  JoinVoiceChannelDto,
  JoinVoiceDto,
  SendingSignalDto,
  ToggleTrackDto,
} from './entities/channel.entity';
import { checkHasSocketRoom, deleteSocketRooms } from '../utils/socketUtil';
import { ChannelType, User } from '@prisma/client';
import { Logger } from '@nestjs/common';

interface UserRecord {
  pid: string;
  user?: User;
  video: boolean;
  audio: boolean;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChannelsGateway implements OnGatewayConnection {
  private logger: Logger = new Logger('ChannelGateWay');

  users: Record<number, UserRecord[]> = {};
  socketToRoom: Record<number, string[]> = {};
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleConnection() {}
  handleDisconnect(socket: Socket) {
    this.logger.log(`client disconnected ${socket.id}`);
    this.disconnect(socket.id);
  }

  @SubscribeMessage('createChannel')
  async create(
    @MessageBody() createChannelDto: CreateChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    // todo check user have role to create channel
    const channels = await this.channelsService.create(createChannelDto);
    return this.server
      .to(`GROUP_ACTIVE_${createChannelDto.groupId}`)
      .emit('CHANNEL_CREATED', channels);
  }

  @SubscribeMessage('updateChannel')
  update(@MessageBody() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(updateChannelDto.id, updateChannelDto);
  }

  @SubscribeMessage('removeChannel')
  remove(@MessageBody() id: number) {
    return this.channelsService.remove(id);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(
    @MessageBody() joinActiveChannelDto: JoinActiveChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { id } = joinActiveChannelDto;
      if (checkHasSocketRoom(socket, `CHANNEL_ACTIVE_${id}`)) {
        return;
      }
      const user = await this.authService.getUserFromToken(
        socket.handshake.auth.token,
      );
      const channel = await this.channelsService.findOne(id);
      if (!channel) {
        throwErr(`Can not find channel`);
      }
      deleteSocketRooms(socket, 'CHANNEL_ACTIVE');
      await socket.join(`CHANNEL_ACTIVE_${channel.id}`);
      // return this.server.to(`${user.id}`).emit('JOIN_CHANNEL');
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('displayMedia')
  async displayMedia(
    @MessageBody() displayMediaDto: DisplayMediaDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { id, pid, value } = displayMediaDto;
    console.log(id, pid, value, 'displayMedia');
    return socket.broadcast
      .to(`CHANNEL_VOICE_${id}`)
      .emit(`DISPLAY_MEDIA`, { pid, value });
  }

  @SubscribeMessage('userTrackToggle')
  async userTrackToggle(
    @MessageBody() toggleTrackDto: ToggleTrackDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { id, kind, value } = toggleTrackDto;
    // console.log(id, kind, value, 'userTrackToggle', socket.id);
    const usersInChannel = this.users[id];
    if (!usersInChannel) {
      return;
    }
    this.users[id] = usersInChannel.map((userRecord: UserRecord) => {
      if (userRecord.pid === socket.id) {
        if (kind === 'video') {
          userRecord.video = value;
        }
        if (kind === 'audio') {
          userRecord.audio = value;
        }
      }
      return userRecord;
    });
    // const user = await this.authService.getUserFromToken(
    //   socket.handshake.auth.token,
    // );
    return socket.broadcast
      .to(`CHANNEL_VOICE_${id}`)
      .emit(`USER_TRACK_CHANGE`, { kind, value, pid: socket.id });
  }

  @SubscribeMessage('userDisconnected')
  async userDisconnected(
    @MessageBody() joinVoiceChannelDto: JoinVoiceChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { id, pid } = joinVoiceChannelDto;
    console.log(id, pid, 'userDisconnected');

    return socket.broadcast
      .to(`CHANNEL_VOICE_${id}`)
      .emit(`USER_DISCONNECTED`, { pid });
  }

  @SubscribeMessage('joinVoiceChannel')
  async joinVoiceChannel(
    @MessageBody() joinVoiceChannelDto: JoinVoiceChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { id } = joinVoiceChannelDto;

      const channel = await this.channelsService.findOne(id);
      if (!channel) {
        throwErr(`Can not find channel`);
      }
      if (channel.type !== ChannelType.VOICE) {
        throwErr(`Can not find channel`);
      }
      if (checkHasSocketRoom(socket, `CHANNEL_VOICE_${id}`)) {
        return;
      }
      deleteSocketRooms(socket, 'CHANNEL_ACTIVE');
      await socket.join(`${socket.id}`);
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('joinVoiceChannelPeer')
  async joinVoiceChannelPeer(
    @MessageBody() joinVoiceDto: JoinVoiceDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { id, audio, video } = joinVoiceDto;
      const user = await this.authService.getUserFromToken(
        socket.handshake.auth.token,
      );
      const channel = await this.channelsService.findOne(id);
      if (!channel) {
        throwErr(`Can not find channel`);
      }
      if (channel.type !== ChannelType.VOICE) {
        throwErr(`Can not find channel`);
      }

      this.logger.log(`client connect ${socket.id} channel ${channel.id}`);
      socket.rooms.forEach((item: string) => {
        // check if user join voice channel but still joining some voice channel before
        if (item.includes('CHANNEL_VOICE') && item !== `CHANNEL_VOICE_${id}`) {
          deleteSocketRooms(socket, item);
          console.log('disconnect', socket.id, ' from ', item);
          this.disconnect(socket.id);
          this.server.to(`${socket.id}`).emit(`RELOAD_PAGE`, { reload: true });
        }
      });

      if (checkHasSocketRoom(socket, `CHANNEL_VOICE_${id}`)) {
        console.log(socket.id, 'user might have been here before 222222');
        // if (this.users[id]) {
        //   const userList = this.users[id].filter((record) => {
        //     console.log(record.user.id === user.id && record.pid !== socket.id);
        //     if (record.user.id === user.id && record.pid !== socket.id) {
        //       this.disconnect(record.pid);
        //     }
        //     // todo same user but different socketId
        //     return !(record.user.id === user.id && record.pid !== socket.id);
        //   });
        //   this.users[id] = userList;
        // }
        // console.log('emit user list ');
        this.server.to(`${socket.id}`).emit(`RELOAD_PAGE`, { reload: true });
        return;
      }
      deleteSocketRooms(socket, 'CHANNEL_VOICE');

      if (this.users[id]) {
        const index = this.users[id].findIndex(
          (record) => record.pid === socket.id,
        );
        if (index > -1) {
          // if this socket has join
          return;
        }

        this.users[id].push({ pid: socket.id, user, audio, video });
      } else {
        this.users[id] = [{ pid: socket.id, user, audio, video }];
      }
      this.socketToRoom[socket.id] = id;
      const usersInThisRoom = this.users[id].filter(
        (userRecord: UserRecord) => {
          return userRecord.pid !== socket.id;
        },
      );
      await socket.join(`CHANNEL_VOICE_${channel.id}`);

      return this.server
        .to(`${socket.id}`)
        .emit(`ALL_USERS`, { users: usersInThisRoom });
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('sendingSignal')
  async sendingSignal(
    @MessageBody() payload: SendingSignalDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { userToSignal, signal, callerID, user, audio, video } = payload;
    console.log(
      callerID,
      signal.type,
      ' me here sending signal to',
      userToSignal,
      video,
      audio,
    );
    return socket
      .to(`${userToSignal}`)
      .emit(`CHANNEL_VOICE_JOINED`, { signal, callerID, user, audio, video });
  }

  @SubscribeMessage('returningSignal')
  async returningSignal(
    @MessageBody() payload: SendingSignalDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { signal, callerID, user, audio, video } = payload;
    console.log(
      socket.id,
      signal.type,
      ' accept and return signal to',
      callerID,
      video,
      audio,
    );
    return this.server.to(`${callerID}`).emit(`RECEIVE_RETURN_SIGNAL`, {
      signal,
      pid: socket.id,
      user,
      audio,
      video,
    });
  }

  @SubscribeMessage('disconnectVoice')
  disconnectVoice(socket: Socket) {
    deleteSocketRooms(socket, 'CHANNEL_VOICE');
    this.disconnect(socket.id);
  }

  disconnect(pid: string) {
    const channelId = this.socketToRoom[pid];
    if (!channelId) {
      return;
    }
    const usersInChannel = this.users[channelId];
    if (!usersInChannel) {
      return;
    }
    delete this.socketToRoom[pid];
    this.users[channelId] = usersInChannel.filter(
      (userRecord: UserRecord) => userRecord.pid !== pid,
    );
    this.server
      .to(`CHANNEL_VOICE_${channelId}`)
      .emit(`USER_DISCONNECTED`, { pid });
  }
}
