import { IsString, Length } from 'class-validator';

export class ResetPassDto {
  @IsString()
  @Length(8, 100) // Longitud mínima y máxima de la contraseña
  password: string;

  @IsString()
  @Length(8, 100) // Longitud mínima y máxima de la contraseña
  confirmPassword: string;
}
