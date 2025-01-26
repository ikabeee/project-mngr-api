import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { status } from 'src/common/enums/status.enum';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: user.email },
            { username: user.username },
            { payrollNumber: user.payrollNumber },
          ],
        },
      });
      if (userExist) {
        throw new ConflictException('USER_ALREADY_EXIST');
      }
      const { password } = user;
      const hash = await bcrypt.hash(password, 10);
      user = { ...user, password: hash };
      const newUser = await this.prisma.user.create({ data: { ...user } });
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('UNEXPECTED_ERROR', error);
    }
  }

  // async findAll() {
  //   try {
  //   } catch (error) {}
  // }

  // async findOne(id: number) {
  //   try {
  //   } catch (error) {}
  // }

  // async update(id: number, user: UpdateUserDto) {
  //   try {
  //   } catch (error) {}
  // }

  // async remove(id: number) {
  //   try {
  //   } catch (error) {}
  // }

  // async changeStatus(status: status) {
  //   try {
  //   } catch (error) {}
  // }
}
