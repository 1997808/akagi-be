import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { throwErr } from '../utils/exception';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}
  async create(createReactionDto: CreateReactionDto) {
    const { unified, emoji, memberId, messageId } = createReactionDto;
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
    });
    if (!message) {
      throwErr('No message to react');
    }
    const member = await this.prisma.member.findFirst({
      where: { id: memberId },
    });
    if (!member) {
      throwErr('Not a member to react');
    }
    return await this.prisma.reaction.create({
      data: {
        unified,
        emoji,
        memberId,
        messageId,
      },
    });
  }

  async findAll(messageId: number) {
    const result = await this.prisma.reaction.groupBy({
      where: { messageId },
      by: ['unified', 'emoji'],
      _count: {
        _all: true,
        emoji: true,
      },
    });
    return result;
  }

  async countReactions(messageId: number, unified: string) {
    const result = await this.prisma.reaction.count({
      where: { messageId, unified },
    });
    return result;
  }

  async findOne(id: number) {
    return await this.prisma.reaction.findUnique({ where: { id } });
  }

  async findOneDuplicate(createReactionDto: CreateReactionDto) {
    const { unified, memberId, messageId } = createReactionDto;
    return await this.prisma.reaction.findFirst({
      where: { unified, memberId, messageId },
    });
  }

  async remove(id: number) {
    return await this.prisma.reaction.delete({ where: { id } });
  }
}
