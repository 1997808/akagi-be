import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
@ApiBearerAuth('defaultToken')
@ApiTags('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAllRole(@AuthUser() user: User) {
    return await this.rolesService.findAll();
  }

  @Post()
  async create(@AuthUser() user: User, @Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }
}
