import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';

@Controller('reactions')
@ApiBearerAuth('defaultToken')
@ApiTags('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get(':messageId')
  async findAllReaction(
    @AuthUser() user: User,
    @Param('messageId') messageId: string,
  ) {
    return await this.reactionsService.findAll(+messageId);
  }
}
