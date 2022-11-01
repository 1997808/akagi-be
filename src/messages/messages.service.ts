import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createMessageDto: CreateMessageDto) {
    const { content, image, groupId, channelId } = createMessageDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    const member = await this.prisma.member.findFirst({
      where: { groupId, userId: user.id },
    });
    return await this.prisma.message.create({
      data: {
        content: content,
        channel: {
          connect: {
            id: channel.id,
          },
        },
        member: {
          connect: {
            id: member.id,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.message.findUnique({ where: { id } });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    return await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.message.delete({ where: { id } });
  }
}
