import { IsString, Length } from 'class-validator';

export class SignOnDto {
  firstName: string;
  lastName: string;
  email: string;
  @Length(8, 100) // Longitud mínima y máxima de la contraseña
  password: string;
}
