import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChannelsService } from '../channels/channels.service';
import { MembersService } from '../members/members.service';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private channelsService: ChannelsService,
    private membersService: MembersService,
    private rolesService: RolesService,
  ) {}

  async create(user: User, createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.create({ data: createGroupDto });
    await this.rolesService.create({
      name: '@everyone',
      permissions: [],
      groupId: group.id,
    });
    await this.channelsService.create({
      name: 'general',
      type: 'TEXT',
      groupId: group.id,
    });
    await this.membersService.create({
      userId: user.id,
      groupId: group.id,
    });

    return group;
  }

  async findAll(userId: number) {
    return await this.membersService.findAllGroupUserIn(userId);
    // return await this.prisma.group.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.group.findUnique({
      where: { id },
      include: { channels: true, members: true, roles: true, invites: true },
    });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return await this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async remove(id: number) {
    await this.prisma.member.deleteMany({ where: { groupId: id } });
    await this.prisma.invite.deleteMany({ where: { groupId: id } });
    await this.prisma.role.deleteMany({ where: { groupId: id } });
    await this.prisma.channel.deleteMany({ where: { groupId: id } });
    await this.prisma.group.delete({ where: { id } });
  }

  async getFullGroupData(id: number) {
    const channels = await this.channelsService.findGroupChannels(id);
    const members = await this.membersService.findGroupMembers(id);
    const roles = await this.rolesService.findGroupRoles(id);
    return { channels, members, roles };
  }
}
