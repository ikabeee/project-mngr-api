import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  googleToken: string;

  @IsString()
  email?: string;

  @IsString()
  payrollNumber?: string;
}
