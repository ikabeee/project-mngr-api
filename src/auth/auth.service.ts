import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
  async SingIn(input: LoginAuthDto) {
    try {
      const { email, payrollNumber, password } = input;
      if (!email && !payrollNumber) {
        throw new BadRequestException('EMAIL_OR_PAYROLLNUMBER_MISSING');
      }
      const findUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: input.email, payrollNumber: input.payrollNumber }],
        },
      });
      if (!findUser) {
        throw new NotFoundException(`USER_NOT_FOUND`);
      }
      const checkPassword = await bcrypt.compare(password, input.password);
      if (!checkPassword) {
        throw new ForbiddenException('PASSWORD_OR_EMAIL_INCORRECT');
      }
      const payload = { id: findUser.id, name: findUser.firstName };
      const token = this.jwtService.sign(payload);
      const login = { user: findUser, token };
      return login;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }
}
