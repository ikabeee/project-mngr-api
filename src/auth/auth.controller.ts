import { Controller, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('singIn')
  async login(
    @Body() user: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user: UserData } = await this.authService.LogIn(user);
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return { user: UserData };
  }
}
