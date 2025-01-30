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

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  payrollNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
  security_question: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
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
