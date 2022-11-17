import { Injectable } from '@nestjs/common';
import { GroupType, MemberStatus, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RolesOnMembersService } from '../roles-on-members/roles-on-members.service';
import { RolesService } from '../roles/roles.service';
import { serverError } from '../utils/exception';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
    private rolesOnMembersService: RolesOnMembersService,
  ) {}

  // todo add default roles for member
  async create(createMemberDto: CreateMemberDto) {
    const member = await this.isUserGroupMember(
      createMemberDto.userId,
      createMemberDto.groupId,
    );
    if (!member) {
      return await this.prisma.member.create({ data: createMemberDto });
    } else {
      if (member.status !== MemberStatus.IN) {
        return await this.update(member.id, { status: MemberStatus.IN });
      } else {
        serverError('User already member');
      }
    }
  }

  async findAll() {
    return await this.prisma.member.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.member.findUnique({ where: { id } });
  }

  async findGroupByMemberId(memberId: number) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId },
      select: { group: true },
    });
    return member.group;
  }

  async findAllGroupUserIn(userId: number) {
    const result = await this.prisma.member.findMany({
      where: { userId, status: MemberStatus.IN },
      select: { group: true },
      orderBy: { group: { name: 'asc' } },
    });
    return result
      .filter((item) => item.group.type === GroupType.GROUP)
      .map((item) => item.group);
  }

  async findAllDirectGroupUserIn(userId: number) {
    const result = await this.prisma.member.findMany({
      where: { userId },
      select: { group: { include: { members: { select: { user: true } } } } },
      orderBy: { group: { createdAt: 'desc' } },
    });
    return result
      .filter((item) => item.group.type === GroupType.DIRECT)
      .map((item) => item.group);
  }

  async isUserGroupMember(userId: number, groupId: number) {
    return await this.prisma.member.findFirst({
      where: { userId, groupId },
    });
  }

  async userJoinGroup(user: User, groupId: number) {
    const role = await this.rolesService.findGroupDefaultEveryoneRoles(groupId);

    const member = await this.create({
      userId: user.id,
      groupId,
    });

    await this.rolesOnMembersService.create({
      memberId: member.id,
      roleId: role.id,
    });

    return member;
  }

  async findGroupMembers(groupId: number) {
    return await this.prisma.member.findMany({ where: { groupId } });
  }

  async findPaginateMember(memberQueryDto: MemberQueryDto) {
    const { take, page, groupId } = memberQueryDto;
    const skip = (page - 1) * take;
    return await this.prisma.member.findMany({
      skip: skip,
      take: take,
      where: { groupId, status: MemberStatus.IN },
      include: { user: true },
      orderBy: { user: { username: 'asc' } },
    });
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

  async canUserKickMember(user: User, memberId: number) {
    const member = await this.findOne(memberId);
    console.log(user.id, member, memberId);
    if (!member) {
      return false;
    }
    if (member.status !== MemberStatus.IN) {
      return false;
    }
    if (user.id === member.userId) {
      // they kick themselves
      return true;
    }
    const kicker = await this.isUserGroupMember(user.id, member.groupId);
    if (!kicker) {
      return false;
    }
    // if (kicker) {
    // todo check user have roles or is group owner
    // return true;
    // }
    return false;
  }

  async memberLeaveGroup(id: number) {
    const member = await this.update(id, { status: MemberStatus.OUT });
    await this.rolesOnMembersService.removeAllRoleFromMember(id);
    return member;
  }
}
