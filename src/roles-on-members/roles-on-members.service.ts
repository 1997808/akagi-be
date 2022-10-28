import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolesOnMembersDto } from '../members/dto/create-roles-on-members.dto';

@Injectable()
export class RolesOnMembersService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRolesOnMembersDto) {
    return await this.prisma.rolesOnMembers.create({ data: createRoleDto });
  }

  async findAll() {
    return await this.prisma.rolesOnMembers.findMany();
  }

  // async findOne(id: number) {
  //   return await this.prisma.rolesOnMembers.findUnique({ where: { id } });
  // }

  // async update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return await this.prisma.rolesOnMembers.update({
  //     where: { id },
  //     data: updateRoleDto,
  //   });
  // }

  // async remove(id: number) {
  //   return await this.prisma.rolesOnMembers.delete({ where: { id } });
  // }
}
