import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './model/auth-response.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const createUserInput = plainToInstance(CreateUserInput, {
      ...input,
      password: hashedPassword,
    });

    const user = await this.userService.create(createUserInput);

    const tokens = this.generateTokens(user);
    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.findByPhone(input.phoneNumber);
    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens(user);

    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse> {
    const user = await this.userService.findOne(userId);
    if (!user?.refreshToken) throw new UnauthorizedException('No session found');

    const isMatch = refreshToken === user.refreshToken;
    if (!isMatch) throw new UnauthorizedException('Invalid token');

    const tokens = this.generateTokens(user);
    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user };
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }

  private generateTokens(user: User) {
    const payload = {
      _id: user._id,
      phoneNumber: user.phoneNumber,
      userName: user.userName,
      userRole: user.userRole,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
