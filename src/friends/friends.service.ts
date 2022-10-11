import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
    // todo: ws sendFriendRequest to receiver
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
    const userSendRequest = await this.update(id, {
      type: FriendshipEnum.FRIEND,
    });
    const friendshipInvert = await this.findOneByUserIdAndFriendId(
      friendship.friendId,
      friendship.userId,
    );
    if (!friendshipInvert) {
      serverError(`No friend data found`);
    }
    const userGetRequest = await this.update(friendshipInvert.id, {
      type: FriendshipEnum.FRIEND,
    });
    // todo: ws send friend to homepage to receiver
    return { userSendRequest, userGetRequest };
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
      include: { friend: true },
    });
    return friends;
  }

  // async findAllUserFriend(user: User) {
  //   const friend = await this.prisma.friendship.findMany({
  //     where: { user, type: FriendshipEnum.FRIEND },
  //     include: { friend: true },
  //   });
  //   const friendRequest = await this.prisma.friendship.findMany({
  //     where: { user, type: FriendshipEnum.OUTGOING || FriendshipEnum.INCOMING },
  //     include: { friend: true },
  //   });
  //   return {
  //     friends,
  //     friendRequests,
  //   };
  // }

  async findOne(id: number) {
    return await this.prisma.friendship.findUnique({ where: { id } });
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    return await this.prisma.friendship.update({
      where: { id },
      data: updateFriendDto,
      include: { friend: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.friendship.delete({ where: { id } });
  }
}
