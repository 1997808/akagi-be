import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@WebSocketGateway({
  namespace: 'friendships',
  cors: {
    origin: '*',
  },
})
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}

  @SubscribeMessage('createFriend')
  create(@MessageBody() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @SubscribeMessage('findAllFriends')
  findAll() {
    console.log('logging');
    return this.friendsService.findAll();
  }

  @SubscribeMessage('findOneFriend')
  findOne(@MessageBody() id: number) {
    return this.friendsService.findOne(id);
  }

  @SubscribeMessage('updateFriend')
  update(@MessageBody() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(updateFriendDto.id, updateFriendDto);
  }

  @SubscribeMessage('removeFriend')
  remove(@MessageBody() id: number) {
    return this.friendsService.remove(id);
  }
}
