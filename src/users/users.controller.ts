import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

import { VerifyUserDto, UpdateUserDto, CreateUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('user.create')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('user.verify')
  verifyUser(@Payload() verifyUser: VerifyUserDto) {
    return this.usersService.verifyUser(verifyUser);
  }

  @MessagePattern('user.findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('user.findOne')
  findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.findEmail')
  findOneEmail(@Payload() email: string) {
    return this.usersService.findOneEmail(email);
  }

  @MessagePattern('user.update')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
}
