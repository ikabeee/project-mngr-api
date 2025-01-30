import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LoginAuthDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  payrollNumber: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  password: string;
}
