import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    return await this.prisma.group.create({ data: createGroupDto });
  }

  async findAll() {
    return await this.prisma.group.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.group.findUnique({ where: { id } });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return await this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.group.delete({ where: { id } });
  }
}
