import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('user.create')
  asynccreate(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('user.findAll')
  asyncfindAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('user.findOne')
  asyncfindOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.findEmail')
  asyncfindOneEmail(@Payload() email: string) {
    return this.usersService.findOneEmail(email);
  }

  @MessagePattern('user.update')
  asyncupdate(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('user.remove')
  async remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
