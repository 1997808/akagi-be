import { Controller, Post, Body } from '@nestjs/common';
import { Get, Req } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { httpError } from '../utils/exception';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (err) {
      httpError(err.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      console.log('catachingasdasd');
      httpError(err.message);
    }
  }

  @Get('checkLogin')
  async checkLogin(@Req() request: Request) {
    try {
      return await this.authService.checkToken(request);
    } catch (err) {
      httpError(err.message);
    }
  }

  // @Get('refresh')
  // refreshToken() {
  // }

  // @Get('logout')
  // logout() {
  // }
}
