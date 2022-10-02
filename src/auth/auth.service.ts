import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new Error(`No user found with email ${email}`);
    }
    if (!(await this.comparePassword(password, user.password))) {
      throw new Error(`Password wrong`);
    }
    const result = await this.generateToken(user);
    return {
      accessToken: result,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const existed = await this.usersService.findOneByEmail(email);
    if (existed) {
      throw new Error(`User found with email ${email}`);
    }
    registerDto.password = await this.hashPassword(password);
    const user = await this.usersService.create(registerDto);
    return {
      ok: !!user,
    };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
