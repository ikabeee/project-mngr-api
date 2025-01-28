import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(input: LoginAuthDto) {
    try {
      const { email, payrollNumber, password } = input;
      if (!email && !payrollNumber) {
        throw new BadRequestException('EMAIL_OR_PAYROLLNUMBER_MISSING');
      }
      const findUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { payrollNumber: input.payrollNumber }],
        },
      });
      if (!findUser) {
        throw new NotFoundException(`USER_NOT_FOUND`);
      }
      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('INCORRECT_PASSWORD');
      }
      const payload = {
        id: findUser.id,
        name: findUser.firstName,
        role: findUser.role,
      };
      const token = this.jwtService.sign(payload);
      return { user: findUser, token };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }
}
