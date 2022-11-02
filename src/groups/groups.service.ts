import { Injectable } from '@nestjs/common';
import { GroupType, User } from '@prisma/client';
import { ChannelsService } from '../channels/channels.service';
import { InvitesService } from '../invites/invites.service';
import { MembersService } from '../members/members.service';
import { PrismaService } from '../prisma/prisma.service';
// import { RolesOnMembersService } from '../roles-on-members/roles-on-members.service';
import { RolesService } from '../roles/roles.service';
import { serverError } from '../utils/exception';
import { CreateDirectGroupDto, CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private channelsService: ChannelsService,
    private membersService: MembersService,
    private rolesService: RolesService,
    // private rolesOnMembersService: RolesOnMembersService,
    private invitesService: InvitesService,
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

    const member = await this.membersService.userJoinGroup(user, group.id);

    if (createGroupDto.type === GroupType.GROUP) {
      createGroupDto.memberOwnerId = member.id;
      await this.prisma.group.update({
        where: { id: group.id },
        data: createGroupDto,
      });
    }

    return group;
  }

  async createDirectMessage(
    user1: User,
    user2: User,
    createGroupDto: CreateDirectGroupDto,
  ) {
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

    await this.membersService.userJoinGroup(user1, group.id);
    await this.membersService.userJoinGroup(user2, group.id);

    return group;
  }

  async findAll(userId: number) {
    return await this.membersService.findAllGroupUserIn(userId);
  }

  async findAllDirect(userId: number) {
    return await this.membersService.findAllDirectGroupUserIn(userId);
  }

  async findOneSimple(id: number) {
    return await this.prisma.group.findUnique({
      where: { id },
    });
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

  async findAvailableInviteByGroupId(user: User, groupId: number) {
    const member = await this.membersService.isUserGroupMember(
      user.id,
      groupId,
    );
    if (!member) {
      serverError('User not member');
    }

    const invites = await this.invitesService.findAvailableByGroupId(groupId);
    if (invites.length > 0) {
      return invites[0];
    }

    if (await this.isMemberOwnerOfGroup(member.id, groupId)) {
      return await this.invitesService.create({
        maxUses: 10,
        createdByMemberId: member.id,
        groupId,
      });
    }
    return null;
  }

  async isMemberOwnerOfGroup(memberId: number, groupId: number) {
    const group = await this.findOneSimple(groupId);
    return group.memberOwnerId === memberId;
  }

  async joinGroupByinviteToken(user: User, token: string) {
    const invite = await this.invitesService.findAvailableByToken(token);
    await this.membersService.userJoinGroup(user, invite.groupId);
    await this.invitesService.minusOneInviteUses(invite.id);
    return await this.findOne(invite.groupId);
  }
}
