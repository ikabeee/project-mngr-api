import { Injectable } from '@nestjs/common';

@Injectable()
export class TestFService {
  findAll() {
    return `This action returns all testF`;
  }
}
