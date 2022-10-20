import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.prisma.role.create({ data: createRoleDto });
  }

  async findAll() {
    return await this.prisma.role.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.role.findUnique({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.role.delete({ where: { id } });
  }
}
