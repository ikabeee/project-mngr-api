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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(Role.ADMIN)
  @Roles(Role.MODERATOR)
  @Post('create')
  async create(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @Roles(Role.ADMIN)
  @Put('changeStatus/:id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: string,
    @Body() status: statusUser,
  ) {
    return this.userService.changeStatus(+id, status);
  }
  @Roles(Role.ADMIN)
  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(+id, updateUser);
  }

  @Roles(Role.ADMIN)
  @Roles(Role.MODERATOR)
  @Get('/all')
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.userService.delete(+id);
  }
}
