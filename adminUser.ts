import { PrismaClient, Role, StatusUser } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // Para encriptar la contraseña

const prisma = new PrismaClient();

const createAdminUser = async () => {
  const userDto = {
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin123',
    email: 'admin@example.com',
    password: 'securePassword123', // Asegúrate de encriptar la contraseña
    hasTeam: false,
    status: StatusUser.Active, // Usar el enum de StatusUser
    role: Role.Admin, // Usar el enum de Role
    security_answer : "20",
    security_question : "Cuantos años tienes?",
    teamId: null, // Si el usuario no tiene equipo, se puede dejar nulo
  };

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Crear el usuario administrador en la base de datos
    const user = await prisma.user.create({
      data: {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        username: userDto.username,
        email: userDto.email,
        password: hashedPassword, // Guardar la contraseña encriptada
        hasTeam: userDto.hasTeam,
        status: userDto.status,
        security_question : userDto.security_question,
        security_answer : userDto.security_answer,
        role: userDto.role,
        teamId: userDto.teamId,
      },
    });

    console.log('Usuario administrador creado:', user);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Ejecutar el script
createAdminUser();
