import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serverError } from '../utils/exception';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async create(createInviteDto: CreateInviteDto) {
    return await this.prisma.invite.create({
      data: createInviteDto,
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

  async findAvailableByToken(token: string) {
    const invite = await this.prisma.invite.findUnique({ where: { token } });
    if (invite.uses === invite.maxUses || invite.uses > invite.maxUses) {
      serverError('Invite token is expire');
    }
    return invite;
  }

  async plusOneInviteUses(id: number) {
    const invite = await this.findOne(id);
    return await this.update(id, { uses: invite.uses + 1 });
  }
}
