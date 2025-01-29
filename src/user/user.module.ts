import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
