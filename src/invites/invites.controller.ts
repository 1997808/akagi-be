import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateInviteDto } from './dto/create-invite.dto';

@Controller('invites')
@ApiBearerAuth('defaultToken')
@ApiTags('invites')
@UseGuards(JwtAuthGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get('group/:groupId')
  async findAvailableByGroupId(
    @AuthUser() user: User,
    @Param('groupId') groupId: string,
  ) {
    return await this.invitesService.findAvailableByGroupId(+groupId);
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createInviteDto: CreateInviteDto,
  ) {
    return await this.invitesService.create(createInviteDto);
  }
}
