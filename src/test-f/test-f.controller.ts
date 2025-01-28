import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TestFService } from './test-f.service';

@Controller('test-f')
export class TestFController {
  constructor(private readonly testFService: TestFService) {}
  @Get()
  findAll(@Req() request: Request) {
    console.log(request.cookies);
  }
}
