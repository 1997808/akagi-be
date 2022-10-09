import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async create(createFriendDto: CreateFriendDto) {
    const friend = await this.prisma.friendship.create({
      data: createFriendDto,
    });
    return friend;
  }

  async findAll() {
    return await this.prisma.friendship.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.friendship.findUnique({ where: { id } });
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    return await this.prisma.friendship.update({
      where: { id },
      data: updateFriendDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.friendship.delete({ where: { id } });
  }
}
