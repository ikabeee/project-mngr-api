import { Module } from '@nestjs/common';
import { TestFService } from './test-f.service';
import { TestFController } from './test-f.controller';

@Module({
  controllers: [TestFController],
  providers: [TestFService],
})
export class TestFModule {}
