import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Roles } from 'src/enums/roles-user.enum';
import { Type } from 'class-transformer';

export class Direccion {
  @IsString()
  city: string;
  @IsString()
  zip: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  address2?: string;
}
export class UpdateUserDto {
  id: number;

  @IsString()
  @IsOptional()
  fullName?: string;
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(Roles, { each: true })
  @IsOptional()
  role?: Roles;
  @IsOptional()
  @IsString()
  telefono?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Direccion)
  direccion?: Direccion;
}
