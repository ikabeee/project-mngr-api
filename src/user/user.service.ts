import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { SignOnDto } from './dto/sign-on.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPassDto } from './dto/reset-pass.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //Retorna todos los usuarios de la bd
  async getAllUsers(): Promise<User[]> {
    try {
      return this.prisma.user.findMany();
    } catch (e) {
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  //Retorna un usuario que coincida con el correo ingresado
  async getUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('El correo electrónico es requerido.');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      // Manejar errores inesperados
      throw new Error(`Error al buscar el usuario: ${error.message}`);
    }
  }

  //Retorna un usuario que coincida con el id
  async getUserById(id: number): Promise<User> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('El id es requerido y debe ser un número.');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con el id ${id} no encontrado.`);
      }
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        // Error cuando no se encuentra el registro
        throw new NotFoundException(`Usuario con el id ${id} no encontrado.`);
      }
      console.error('Error al buscar el usuario:', error); // Registrar el error para depuración
      throw new InternalServerErrorException(
        'Ocurrió un error al buscar el usuario.',
      );
    }
  }

  //Funcion para hashear contraseña
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  //Funcion para crear usuarios nuevos
  async createUser(user: SignOnDto): Promise<User> {
    if (!user.email || !user.password || !user.firstName || !user.lastName) {
      throw new BadRequestException(
        'Correo, contraseña, nombre y apellido son obligatorios .',
      );
    }
    // Verificar si el usuario ya existe por email o username
    const existingUser = await this.prisma.user.findUnique({
      where: {
         email: user.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'El correo ya está registrado',
      );
    }
    const hashedPassword = await this.hashPassword(user.password);
    try {
      return await this.prisma.user.create({
        data: { ...user, password: hashedPassword },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'El correo ya está en uso.',
        );
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

  //Funcion para eliminar usuarios
  async deleteUser(id: number): Promise<User> {
    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!checkUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!id) {
      throw new BadRequestException('El id es obligatorio.');
    }
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  //Funcion que actualiza los datos del usuario
  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new BadRequestException('El ID es obligatorio.');
    }
    //Valida si el usuario con ese id existe
    const findUser = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }

    // Buscar si existe otro usuario con el mismo email
    if (user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(
          'El usuario o el correo ya están registrados',
        );
      }
    }

    // Si la contraseña fue proporcionada, encriptarla antes de actualizar
    const updatedData: UpdateUserDto = { ...user };
    if (user.password) {
      try {
        updatedData.password = await this.hashPassword(user.password);
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al procesar la contraseña.',
        );
      }
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updatedData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(`Error al actualizar el usuario: ${error}`);
      }
    }
  }

  async resetPassword(id: number, user: ResetPassDto): Promise<User> {
    if (!id) {
      throw new BadRequestException('El id es obligatorio.');
    }

    if (!user.password || !user.confirmPassword) {
      throw new BadRequestException('Ambas contraseñas son obligatorias.');
    }

    if (user.password !== user.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    // Validar que el usuario exista
    const findUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!findUser) {
      throw new NotFoundException('El usuario no existe.');
    }

    try {
      // Hashear la nueva contraseña
      const hashedPassword = await this.hashPassword(user.password);

      // Actualizar la contraseña
      return await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new Error(
        `Error al actualizar la contraseña del usuario: ${error}`,
      );
    }
  }
}
