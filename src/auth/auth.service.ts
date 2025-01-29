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
import { GoogleAuthDto } from './dto/Google-auth-dto';
import axios from 'axios';

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

  async GoogleAuth(input: GoogleAuthDto) {
    try {
      const { googleToken, email, payrollNumber } = input;
  
      // Intercambiar el código de autorización por un token de acceso
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code: googleToken, // Código recibido desde el frontend
          client_id: clientId,
          client_secret: secretClient,
          redirect_uri: 'http://localhost:3000/auth/google/callback',
          grant_type: 'authorization_code',
        },
      );
  
      const { id_token } = tokenResponse.data;

      // Verificar el ID Token
      const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`,
      );
  
      const googleData = googleResponse.data;
  
      if (!googleData || !googleData.email_verified) {
        throw new ForbiddenException('INVALID_GOOGLE_TOKEN');
      }
  
      const googleEmail = googleData.email;
  
      // Buscar al usuario por email o número de nómina
      const findUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: googleEmail }, { email }, { payrollNumber }],
        },
      });
  
      if (!findUser) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
  
      // Generar token JWT si todo está correcto
      const payload = { id: findUser.id, name: findUser.firstName };
      const token = this.jwtService.sign(payload);
  
      const { password, ...userWithoutPassword } = findUser;
  
      return { user: userWithoutPassword, token, mfa: 'GOOGLE' };
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
