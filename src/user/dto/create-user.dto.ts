/* eslint-disable no-useless-escape */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { statusUser } from 'src/common/enums/statusUser.enum';

// Patrón actualizado: permite letras (incluyendo acentuadas), dígitos, espacios y caracteres especiales
const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(allowedPattern, {
    message:
      'El nombre solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(allowedPattern, {
    message:
      'El apellido solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(allowedPattern, {
    message:
      'El correo electrónico solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(allowedPattern, {
    message:
      'La contraseña solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(allowedPattern, {
    message:
      'El número de nómina solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  payrollNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZÀ-ÿ0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/¿?]*$/, {
    message:
      'La pregunta de seguridad solo puede contener letras, números, espacios y caracteres especiales permitidos, incluyendo signos de interrogación',
  })
  security_question: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(allowedPattern, {
    message:
      'La respuesta de seguridad solo puede contener letras, números, espacios y caracteres especiales permitidos',
  })
  security_answer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  hasTeam: boolean;

  @ApiProperty({ enum: ['Active', 'Inactive', 'Suspended', 'Deleted'] })
  @IsNotEmpty()
  @IsEnum(statusUser, { message: 'Invalid status provided' })
  status: statusUser;

  @ApiProperty({
    enum: ['Admin', 'Leader', 'Moderator', 'Collaborator', 'Guest'],
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  teamId: number;
}
