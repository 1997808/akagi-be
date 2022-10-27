import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';

@Controller('members')
@ApiBearerAuth('defaultToken')
@ApiTags('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findAllMemberByUser(@AuthUser() user: User) {
    return await this.membersService.findAll();
  }

  @Post('group')
  async findPaginateMember(
    @AuthUser() user: User,
    @Body() memberQueryDto: MemberQueryDto,
  ) {
    return await this.membersService.findPaginateMember(memberQueryDto);
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return await this.membersService.create(createMemberDto);
  }
}
