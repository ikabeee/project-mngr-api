import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { role } from 'src/common/enums/role.enum';
import { statusUser } from 'src/common/enums/statusUser.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  payrollNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  hasTeam: boolean;

  @ApiProperty({ enum: ['Active', 'Inactive', 'Suspended', 'Deleted'] })
  @IsNotEmpty()
  @IsEnum(statusUser)
  status: statusUser;

  @ApiProperty({
    enum: ['Admin', 'Leader', 'Moderator', 'Collaborator', 'Guest'],
  })
  @IsNotEmpty()
  @IsEnum(role)
  role: role;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  teamId: number;
}
