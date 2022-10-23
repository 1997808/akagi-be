import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
@ApiBearerAuth('defaultToken')
@ApiTags('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async findAllGroupByUser(@AuthUser() user: User) {
    return await this.groupsService.findAll(user.id);
  }

  @Get(':id')
  async findGroupById(@AuthUser() user: User, @Param('id') id: string) {
    return await this.groupsService.findOne(+id);
  }

  @Post()
  async create(@AuthUser() user: User, @Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(user, createGroupDto);
  }
}
