import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  // todo add default roles for member
  async create(createMemberDto: CreateMemberDto) {
    return await this.prisma.member.create({ data: createMemberDto });
  }

  async findAll() {
    return await this.prisma.member.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.member.findUnique({ where: { id } });
  }

  async findAllGroupUserIn(userId: number) {
    const result = await this.prisma.member.findMany({
      where: { userId },
      select: { group: true },
      orderBy: { group: { name: 'asc' } },
    });
    return result.map((item) => item.group);
  }

  async isUserGroupMember(userId: number, groupId: number) {
    return await this.prisma.member.findMany({ where: { userId, groupId } });
  }

  async findGroupMembers(groupId: number) {
    return await this.prisma.member.findMany({ where: { groupId } });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    return await this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.member.delete({ where: { id } });
  }
}
