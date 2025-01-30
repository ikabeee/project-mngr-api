import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(input: LoginAuthDto) {
    try {
      const { email, payrollNumber, password } = input;
      if (!email && !payrollNumber) {
        throw new BadRequestException('EMAIL_OR_PAYROLLNUMBER_MISSING');
      }
      if (!password) {
        throw new BadRequestException('PASSWORD_MISSING');
      }
      const findUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { payrollNumber: input.payrollNumber }],
        },
      });
      if (!findUser) {
        throw new NotFoundException(`USER_NOT_FOUND`);
      }
      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('INCORRECT_PASSWORD');
      }
       return {
        status: 'WAITING_FOR_SECURITY_QUESTION',
        userId: findUser.id,
        question: findUser.security_question,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('UNEXPECTED_ERROR');
    }
  }

  async validateSecurityAnswer(userId: number, securityAnswer: string) {
    try {
      console.log("Validating security answer for user:", userId)

      const findUser = await this.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!findUser) {
        console.log("User not found:", userId)
        throw new NotFoundException("USER_NOT_FOUND")
      }

      console.log("User found:", findUser.id)
      console.log("Stored security answer:", findUser.security_answer)
      console.log("Provided security answer:", securityAnswer)

      // Check if the stored security answer is already hashed
      const isAlreadyHashed = /^\$2[ayb]\$.{56}$/.test(findUser.security_answer)
      console.log("Is security answer already hashed:", isAlreadyHashed)

      let isSecurityAnswerValid: boolean

      if (isAlreadyHashed) {
        isSecurityAnswerValid = await bcrypt.compare(securityAnswer, findUser.security_answer)
      } else {
        // If not hashed, compare directly (not recommended for production)
        isSecurityAnswerValid = securityAnswer === findUser.security_answer

        if (isSecurityAnswerValid) {
          // Hash the security answer for future use
          const hashedAnswer = await bcrypt.hash(securityAnswer, 10)
          await this.prisma.user.update({
            where: { id: userId },
            data: { security_answer: hashedAnswer },
          })
          console.log("Security answer hashed and updated")
        }
      }

      console.log("Is security answer valid:", isSecurityAnswerValid)

      if (!isSecurityAnswerValid) {
        throw new UnauthorizedException("INCORRECT_SECURITY_ANSWER")
      }

      const payload = {
        id: findUser.id,
        name: findUser.firstName,
        role: findUser.role,
      }
      const token = this.jwtService.sign(payload)

      return { token }
    } catch (error) {
      console.error("Error in validateSecurityAnswer:", error)
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException("UNEXPECTED_ERROR: " + error.message)
    }
  }
}
