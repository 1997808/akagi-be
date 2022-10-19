import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    return await this.prisma.member.create({ data: createMemberDto });
  }

  async findAll() {
    return await this.prisma.member.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.member.findUnique({ where: { id } });
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
