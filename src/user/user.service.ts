import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { statusUser } from 'src/common/enums/statusUser.enum';

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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { team: true, task: true },
      });
      if (!user) {
        throw new NotFoundException(`USER_WITH_ID_${id}_NOT_FOUND`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: { team: true, task: true },
      });
      if (users.length === 0 || !users) {
        throw new NotFoundException(`NO_USERS_FOUND`);
      }
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    try {
      const checkUser = await this.prisma.user.findFirst({ where: { id } });
      if (!checkUser) {
        throw new NotFoundException(`USER_WITH_ID_${id}_NOT_FOUND`);
      }
      const userUpdated = await this.prisma.user.update({
        where: { id },
        data: { ...user },
        include: {
          team: true,
          task: true,
        },
      });
      return userUpdated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  async changeStatus(id: number, status: statusUser): Promise<User> {
    try {
      if (!status) {
        throw new BadRequestException('STATUS_MISSING');
      }
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`USER_WITH_ID_${id}_NOT_FOUND`);
      }
      const statusUpdated = await this.prisma.user.update({
        where: { id },
        data: { status },
        include: { team: true, task: true },
      });

      return statusUpdated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(`UNEXPECTED_ERROR_${error}`);
    }
  }
  async delete(id: number): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`USER_WITH_ID_${id}_NOT_FOUND`);
      }
      const userDeleted = await this.prisma.user.delete({ where: { id } });
      return `USER_DELETED_${userDeleted.id}`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }
}
