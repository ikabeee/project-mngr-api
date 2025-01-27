import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { statusUser } from 'src/common/enums/statusUser.enum';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //Only admins and moderators could create users
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
  // @Get('/all')
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
