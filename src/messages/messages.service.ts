import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChannelsService } from '../channels/channels.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private channelsService: ChannelsService,
  ) {}

  async create(user: User, createMessageDto: CreateMessageDto) {
    const { content, image, groupId, channelId } = createMessageDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    const member = await this.prisma.member.findFirst({
      where: { groupId, userId: user.id },
    });
    const message = await this.prisma.message.create({
      data: {
        content: content || null,
        image: image || null,
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
      include: {
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    this.channelsService.update(channel.id, { lastMessageId: message.id });
    return message;
  }

  async findByChannelFromLastMessageId(channelId: number, lastId: number) {
    return await this.prisma.message.findMany({
      skip: 0,
      take: 10,
      cursor: { id: lastId },
      where: { channelId },
      include: {
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
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
