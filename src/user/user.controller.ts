import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Get,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { statusUser } from 'src/common/enums/statusUser.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async create(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @Put('changeStatus/:id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: string,
    @Body() status: statusUser,
  ) {
    return this.userService.changeStatus(+id, status);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(+id, updateUser);
  }

  @Get('/all')
  async findAll() {
    return this.userService.findAll();
  }
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.userService.delete(+id);
  }
}
