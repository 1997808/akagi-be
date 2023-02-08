import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
@ApiBearerAuth('defaultToken')
@ApiTags('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('group')
  async findAllGroupByUser(@AuthUser() user: User) {
    return await this.groupsService.findAll(user.id);
  }

  @Get('direct')
  async findAllDirectGroupByUser(@AuthUser() user: User) {
    return await this.groupsService.findAllDirect(user.id);
  }

  @Get('public')
  async findAllPublicGroup(@AuthUser() user: User) {
    return await this.groupsService.findAllPublic();
  }

  @Get(':id')
  async findGroupById(@AuthUser() user: User, @Param('id') id: string) {
    return await this.groupsService.findOne(+id);
  }

  @Get('invite/:groupId')
  async findAvailableInviteByGroupId(
    @AuthUser() user: User,
    @Param('groupId') groupId: string,
  ) {
    return await this.groupsService.findAvailableInviteByGroupId(
      user,
      +groupId,
    );
  }

  @Post()
  async create(@AuthUser() user: User, @Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(user, createGroupDto);
  }

  @Patch(':id')
  update(@AuthUser() user: User, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(updateGroupDto.id, updateGroupDto);
  }
}
