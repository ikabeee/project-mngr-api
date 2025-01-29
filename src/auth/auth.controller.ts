/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    const { status, userId, question } = await this.authService.login(user);

    return {
      status,
      userId,
      question,
    };
  }

  @Post('validate-security-answer')
  @HttpCode(HttpStatus.OK)
  async validateSecurityAnswer(
    @Body() body: { userId: number; securityAnswer: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { userId, securityAnswer } = body;

    const { token } = await this.authService.validateSecurityAnswer(userId, securityAnswer);

    response.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return { token };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
