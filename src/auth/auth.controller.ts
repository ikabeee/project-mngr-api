import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './../common/decorators/public.decorator';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() user: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user: UserData } = await this.authService.login(user);
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return { user: UserData };
  }

  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return req.user;
  }
}
