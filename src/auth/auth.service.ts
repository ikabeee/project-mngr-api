import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  // async login(user: LoginAuthDto): Promise<User> {
  //   try {
  //   } catch (error) {
  //     throw new InternalServerErrorException('UNEXPECTED_ERROR', error);
  //   }
  // }
}
