import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePinMessageDto } from './dto/create-pin-message.dto';
import { Server } from 'socket.io';

@Injectable()
export class PinMessagesService {
  constructor(private prisma: PrismaService) {}
  async create(server: Server, createPinMessageDto: CreatePinMessageDto) {
    const existed = await this.checkChannelPinMessageExisted(
      createPinMessageDto,
    );
    // 1 message only pin once
    if (existed) {
      await this.remove(server, existed.id);
    }
    const createdPinMessage = await this.prisma.pinMessage.create({
      data: createPinMessageDto,
    });
    const pinMessage = await this.findOne(createdPinMessage.id);
    server
      .to(`CHANNEL_ACTIVE_${pinMessage.channelId}`)
      .emit('ADD_PIN_MESSAGE', pinMessage);
  }

  async findOne(id: number) {
    return await this.prisma.pinMessage.findFirst({
      where: { id },
      include: {
        message: {
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
        },
      },
    });
  }

  async findChannelPinMessage(channelId: number) {
    return await this.prisma.pinMessage.findMany({
      skip: 0,
      take: 10,
      where: { channelId },
      include: {
        message: {
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
        },
      },

      orderBy: { id: 'desc' },
    });
  }

  async remove(server: Server, id: number) {
    // todo handle send remove message
    const deletedPinMessage = await this.prisma.pinMessage.delete({
      where: { id },
    });
    server
      .to(`CHANNEL_ACTIVE_${deletedPinMessage.channelId}`)
      .emit('REMOVE_PIN_MESSAGE', deletedPinMessage);
  }

  async checkChannelPinMessageExisted(
    createPinMessageDto: CreatePinMessageDto,
  ) {
    const { channelId, messageId } = createPinMessageDto;
    return await this.prisma.pinMessage.findFirst({
      where: { channelId, messageId },
    });
  }
}
