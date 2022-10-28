import { Injectable } from '@nestjs/common';
import { GroupType, User } from '@prisma/client';
import { ChannelsService } from '../channels/channels.service';
import { InvitesService } from '../invites/invites.service';
import { MembersService } from '../members/members.service';
import { PrismaService } from '../prisma/prisma.service';
import { RolesOnMembersService } from '../roles-on-members/roles-on-members.service';
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
    private rolesOnMembersService: RolesOnMembersService,
    private invitesService: InvitesService,
  ) {}

  async create(user: User, createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.create({ data: createGroupDto });

    const role = await this.rolesService.create({
      name: '@everyone',
      permissions: [],
      groupId: group.id,
    });

    await this.channelsService.create({
      name: 'general',
      type: 'TEXT',
      groupId: group.id,
    });

    const member = await this.membersService.create({
      userId: user.id,
      groupId: group.id,
    });

    await this.rolesOnMembersService.create({
      memberId: member.id,
      roleId: role.id,
    });

    if (createGroupDto.type === GroupType.GROUP) {
      createGroupDto.memberOwnerId = member.id;
      await this.prisma.group.update({
        where: { id: group.id },
        data: createGroupDto,
      });
    }

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

  async joinGroupByinviteToken(user: User, token: string) {
    const invite = await this.invitesService.findAvailableByToken(token);
    await this.membersService.userJoinGroup(user, invite.groupId);
    await this.invitesService.plusOneInviteUses(invite.id);
    return await this.findOne(invite.groupId);
  }
}
