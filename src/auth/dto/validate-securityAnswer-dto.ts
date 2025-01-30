import { IsNumber, IsString } from 'class-validator';

export class ValidateSecurityAnswerDto {
  @IsNumber()
  userId: number;

  @IsString()
  securityAnswer: string;
}
