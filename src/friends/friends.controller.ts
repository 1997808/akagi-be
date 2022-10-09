import { Controller, Get, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';

@Controller('friends')
@ApiBearerAuth('defaultToken')
@ApiTags('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async findAllUserFriend(@AuthUser() user: User) {
    return await this.friendsService.findAllUserFriend(user);
  }
}
