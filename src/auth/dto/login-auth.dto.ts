import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  payrollNumber: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password: string;
}
