import { Injectable } from '@nestjs/common';
import { Friendship, GroupType, User } from '@prisma/client';
import { GroupsService } from '../groups/groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { serverError } from '../utils/exception';
import { FriendshipEnum } from '../utils/type';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private groupsService: GroupsService,
  ) {}

  async sendFriendRequest(user: User, createFriendDto: CreateFriendDto) {
    const { email } = createFriendDto;
    const userId = user.id;

    const friend = await this.usersService.findOneByEmail(email);
    if (!friend) {
      serverError(`Can not send friend request`);
    }
    const friendId = friend.id;
    let userSendRequest: any;
    let userGetRequest: any;

    const checkExisted = await this.findOneByUserIdAndFriendId(
      userId,
      friendId,
    );
    const checkExistedInvert = await this.findOneByUserIdAndFriendId(
      friendId,
      userId,
    );
    if (
      checkExisted &&
      checkExisted.type !== FriendshipEnum.CANCEL &&
      checkExisted.type !== FriendshipEnum.BLOCK
    ) {
      serverError(`Can not send friend request`);
    }

    if (
      checkExisted &&
      (checkExisted.type === FriendshipEnum.CANCEL ||
        checkExisted.type === FriendshipEnum.BLOCK)
    ) {
      userSendRequest = await this.update(checkExisted.id, {
        type: FriendshipEnum.OUTGOING,
      });
      userGetRequest = await this.update(checkExistedInvert.id, {
        type: FriendshipEnum.INCOMING,
      });
    }

    if (!checkExisted) {
      userSendRequest = await this.prisma.friendship.create({
        data: { type: FriendshipEnum.OUTGOING, userId, friendId },
        include: { friend: true },
      });
      userGetRequest = await this.prisma.friendship.create({
        data: {
          type: FriendshipEnum.INCOMING,
          userId: friendId,
          friendId: userId,
        },
        include: { friend: true },
      });
    }
    return { userSendRequest, userGetRequest };
  }

  async acceptFriendRequest(user: User, updateFriendDto: UpdateFriendDto) {
    const { id } = updateFriendDto;
    const friendship = await this.prisma.friendship.findFirst({
      where: { id, type: { not: FriendshipEnum.FRIEND } },
    });
    if (user.id !== friendship.userId) {
      serverError(`No authority`);
    }
    const friendshipInvert = await this.findOneByUserIdAndFriendId(
      friendship.friendId,
      friendship.userId,
    );
    if (!friendshipInvert) {
      serverError(`No friend data found`);
    }
    const userSendRequest = await this.update(id, {
      type: FriendshipEnum.FRIEND,
    });
    const userGetRequest = await this.update(friendshipInvert.id, {
      type: FriendshipEnum.FRIEND,
    });
    const direct = await this.groupsService.createDirectMessage(
      userSendRequest.user,
      userSendRequest.friend,
      { type: GroupType.DIRECT },
    );
    const group = await this.groupsService.findOneForDirect(direct.id);

    return { userSendRequest, userGetRequest, group };
  }

  async removeFriendRequest(user: User, updateFriendDto: UpdateFriendDto) {
    const { id } = updateFriendDto;
    const friendship = await this.findOne(id);
    if (!friendship) {
      serverError(`No friend data found`);
    }
    if (user.id !== friendship.userId && user.id !== friendship.friendId) {
      serverError(`No authority`);
    }
    const friendshipInvert = await this.findOneByUserIdAndFriendId(
      friendship.friendId,
      friendship.userId,
    );
    if (!friendshipInvert) {
      serverError(`No friend data found`);
    }
    const userSendRequest = await this.update(id, {
      type: FriendshipEnum.CANCEL,
    });
    const userGetRequest = await this.update(friendshipInvert.id, {
      type: FriendshipEnum.CANCEL,
    });

    // todo: ws send remove friend to homepage to receiver
    return { userSendRequest, userGetRequest };
  }

  async findOneByUserIdAndFriendId(userId: number, friendId: number) {
    return await this.prisma.friendship.findFirst({
      where: { userId, friendId },
      include: { friend: true },
    });
  }

  async findAllUserFriend(user: User) {
    const friends = await this.prisma.friendship.findMany({
      where: { user, type: { not: FriendshipEnum.CANCEL } },
      include: { user: true, friend: true },
    });
    return friends;
  }

  async findOne(id: number) {
    return await this.prisma.friendship.findUnique({ where: { id } });
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    return await this.prisma.friendship.update({
      where: { id },
      data: updateFriendDto,
      include: { user: true, friend: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.friendship.delete({ where: { id } });
  }
}
