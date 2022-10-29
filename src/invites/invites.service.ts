import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serverError } from '../utils/exception';
import { getRandomToken } from '../utils/getRandomToken';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async create(createInviteDto: CreateInviteDto) {
    const token = getRandomToken(
      createInviteDto.groupId,
      createInviteDto.createdByMemberId,
    );
    return await this.prisma.invite.create({
      data: { ...createInviteDto, token, uses: createInviteDto.maxUses },
    });
  }

  async findAll() {
    return await this.prisma.invite.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.invite.findUnique({ where: { id } });
  }

  async update(id: number, updateInviteDto: UpdateInviteDto) {
    return await this.prisma.invite.update({
      where: { id },
      data: updateInviteDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.invite.delete({ where: { id } });
  }

  async findAvailableByGroupId(groupId: number) {
    const invite = await this.prisma.invite.findMany({
      where: { groupId, uses: { gt: 0 } },
    });
    return invite;
  }

  async findAvailableByToken(token: string) {
    const invite = await this.prisma.invite.findFirst({
      where: { token, uses: { gt: 0 } },
    });
    if (invite.uses < 1) {
      serverError('Invite token is expire');
    }
    return invite;
  }

  async minusOneInviteUses(id: number) {
    const invite = await this.findOne(id);
    return await this.update(id, { uses: invite.uses - 1 });
  }
}
