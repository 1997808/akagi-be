import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { AuthUser } from './users/user.decorator';

@ApiBearerAuth('defaultToken')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(@AuthUser() user: User): any {
    // return this.appService.getHello();
    return user;
  }
}
