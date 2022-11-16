import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { serverError } from '../utils/exception';
import { Socket } from 'socket.io';

@Injectable()
export class AuthService {
  userOnline: number[] = [];
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, verifyToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      serverError(`Email or password wrong`);
    }
    if (!(await this.comparePassword(password, user.password))) {
      serverError(`Email or password wrong`);
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
      serverError(`Email duplicate`);
    }
    registerDto.password = await this.hashPassword(password);
    const user = await this.usersService.create(registerDto);
    return {
      ok: !!user,
    };
  }

  async getUserFromToken(token: string) {
    try {
      const jwt = token.replace('Bearer ', '');
      if (jwt == 'null') {
        return null;
      }
      const data = await this.jwtService.verifyAsync(jwt);
      if (!data) {
        return null;
      }
      const user = await this.usersService.findOne(data.id);
      // const { password, verifyToken, ...result } = user;
      return user;
    } catch (err) {
      return null;
    }
  }

  async checkToken(request: any) {
    try {
      if (!request.headers.authorization) {
        return false;
      }
      const jwt = request.headers.authorization.replace('Bearer ', '');
      if (jwt === 'null' || jwt === '') {
        return false;
      }
      const data = await this.jwtService.verifyAsync(jwt);
      if (!data) {
        return false;
      }
      const user = await this.usersService.findOne(data.id);
      if (user) return true;
      return false;
    } catch (err) {
      return false;
    }
  }

  getAllOnlineUser() {
    return this.userOnline;
  }

  handleUserOnline(socket: Socket, id: number) {
    if (!this.userOnline.includes(id)) {
      this.userOnline.push(id);
      socket.broadcast.emit('USER_ONLINE', id);
    }
  }

  handleUserDisconnect(socket: Socket, id: number) {
    this.userOnline = this.userOnline.filter((userId) => userId !== id);
    socket.broadcast.emit('USER_OFFLINE', id);
  }

  private async generateToken(user: User) {
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
