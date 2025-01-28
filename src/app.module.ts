import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TestFModule } from './test-f/test-f.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    TestFModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
