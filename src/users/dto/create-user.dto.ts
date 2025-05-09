import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Roles } from 'src/enums/roles-user.enum';

export class CreateUserDto {
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
