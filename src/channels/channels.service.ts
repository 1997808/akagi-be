import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto) {
    return await this.prisma.channel.create({ data: createChannelDto });
  }

  async findAll() {
    return await this.prisma.channel.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.channel.findUnique({ where: { id } });
  }

  async findGroupChannels(groupId: number) {
    return await this.prisma.channel.findMany({ where: { groupId } });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    return await this.prisma.channel.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.channel.delete({ where: { id } });
  }
}
