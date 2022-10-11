import { Controller, Post, Body } from '@nestjs/common';
import { Get, Req } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('checkLogin')
  async checkLogin(@Req() request: Request) {
    return await this.authService.checkToken(request);
  }

  // @Get('refresh')
  // refreshToken() {
  // }

  // @Get('logout')
  // logout() {
  // }
}
