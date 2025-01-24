import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SignOnDto } from './dto/sign-on.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPassDto } from './dto/reset-pass.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('allUsers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post('createUser')
  createUser(@Body() data: SignOnDto) {
    return this.userService.createUser(data);
  }

  @Put('updateUser/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateUser(parseInt(id), data);
  }

  @Patch('resetPassword/:id')
  resetPassword(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: ResetPassDto,
  ) {
    return this.userService.resetPassword(parseInt(id), data);
  }

  @Delete('deleteUser/:id')
  deleteUser(@Param('id', ParseIntPipe) id: string) {
    return this.userService.deleteUser(Number(id));
  }
}
