import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChannelsService } from './channels.service';
import { Socket, Server } from 'socket.io';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthService } from '../auth/auth.service';
import { serverError } from '../utils/exception';
import { JoinActiveChannelDto } from './entities/channel.entity';
import { checkHasSocketRoom, deleteSocketRooms } from '../utils/socketUtil';
import { ChannelType } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChannelsGateway {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

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
      .to(`${createChannelDto.groupId}`)
      .emit('CHANNEL_CREATED', channels);
  }

  @SubscribeMessage('findAllChannels')
  findAll() {
    return this.channelsService.findAll();
  }

  @SubscribeMessage('findOneChannel')
  findOne(@MessageBody() id: number) {
    return this.channelsService.findOne(id);
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
    const { id } = joinActiveChannelDto;
    if (checkHasSocketRoom(socket, `CHANNEL_ACTIVE_${id}`)) {
      return;
    }
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const channel = await this.channelsService.findOne(id);
    if (!channel) {
      serverError(`Can not find channel`);
    }
    deleteSocketRooms(socket, 'CHANNEL_ACTIVE');
    await socket.join(`CHANNEL_ACTIVE_${channel.id}`);
    return this.server.to(`${user.id}`).emit('JOIN_CHANNEL');
  }

  @SubscribeMessage('joinVoiceChannel')
  async joinVoiceChannel(
    @MessageBody() joinActiveChannelDto: JoinActiveChannelDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = joinActiveChannelDto;
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const channel = await this.channelsService.findOne(id);
    if (!channel) {
      serverError(`Can not find channel`);
    }
    if (channel.type !== ChannelType.VOICE) {
      serverError(`Can not find channel`);
    }
    await socket.join(`CHANNEL_VOICE_${channel.id}`);
    return socket.broadcast
      .to(`CHANNEL_VOICE_${channel.id}`)
      .emit(`CHANNEL_VOICE_JOINED`, user.id);
  }
}
