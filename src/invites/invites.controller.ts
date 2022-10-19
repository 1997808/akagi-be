import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

  @Get()
  async findAllInvite(@AuthUser() user: User) {
    return await this.invitesService.findAll();
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createInviteDto: CreateInviteDto,
  ) {
    return await this.invitesService.create(createInviteDto);
  }
}
