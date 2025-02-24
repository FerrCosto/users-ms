import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Roles } from '@prisma/client';
import { envs } from 'src/config/envs.config';
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { User } from './entities';

import { VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Contectado a la base: ', envs.database_url);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'User alredy exists',
        });
      }

      const createUser = await this.user.create({
        data: {
          email: createUserDto.email,
          fullName: createUserDto.fullName,
          role: Roles.CLIENT,
          password: bcrypt.hashSync(createUserDto.password, 10),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { editadoEn, creadoEn, password, ...resData } = createUser;

      return resData;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<User> {
    const { email, password } = verifyUserDto;
    const user = await this.user.findFirst({ where: { email } });

    if (!user) {
      throw new RpcException({
        status: 400,
        message: 'Email/Password not valid',
      });
    }

    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword)
      throw new RpcException({
        status: 400,
        message: `Email/Password not valid`,
      });

    const { password: _password, creadoEn, editadoEn, ...resData } = user;
    return {
      ...resData,
    };
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.user.findMany();
      if (!users) {
        throw new RpcException({
          status: 404,
          message: 'Users not found',
        });
      }

      return users.map((user) => {
        const { password, ...resData } = user;
        return resData;
      });
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.user.findFirst({ where: { id } });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found',
        });
      }

      const { password, ...resData } = user;
      return resData;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async findOneEmail(email: string): Promise<User> {
    try {
      const user = await this.user.findFirst({ where: { email } });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found',
        });
      }

      const { password, ...resData } = user;
      return resData;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { direccion, email, fullName, telefono } = updateUserDto;
      const user = await this.user.findFirst({ where: { id } });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found',
        });
      }

      await this.user.update({
        where: { id },
        data: {
          ...(direccion && {
            addresses: {
              set: [
                {
                  address: direccion.address,
                  address2: direccion.address2 || null,
                  city: direccion.city,
                  zip: direccion.zip,
                },
              ],
            },
          }),
          ...(telefono && { telefono }),
          ...(fullName && { fullName }),
          ...(email && { email }),
        },
      });

      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async updateRole(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    try {
      await this.user.update({
        where: { id },
        data: { role: updateUserRoleDto.role },
      });
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Mirar los logs',
      });
    }
  }

  async remove(id: string): Promise<RpcException> {
    try {
      const user = this.user.findFirst({ where: { id } });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found',
        });
      }

      await this.user.delete({ where: { id } });

      return new RpcException({
        status: 200,
        message: 'User delete correct',
      });
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }
}
