import { Injectable } from '@nestjs/common';
import { GroupType, User } from '@prisma/client';
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
    if (
      !!(await this.isUserGroupMember(
        createMemberDto.userId,
        createMemberDto.groupId,
      ))
    ) {
      serverError('User already member');
    }
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
      where: { groupId },
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
}
