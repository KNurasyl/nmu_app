import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshInput } from './dto/refresh.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './model/auth-response.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return await this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Mutation(() => AuthResponse)
  async refreshTokens(@Args('input') input: RefreshInput) {
    return await this.authService.refreshTokens(input.userId, input.refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async logout(@Args('userId') userId: string) {
    await this.authService.logout(userId);
    return true;
  }
}
