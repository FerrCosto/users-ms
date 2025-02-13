import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { envs } from 'src/config/envs.config';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { User } from './entities';
import { Roles } from 'src/enums/roles-user.enum';

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
          role: createUserDto.roles,
        },
      });

      const { editadoEn, id, ...resData } = createUser;

      return resData;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
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

      return users;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.user.findFirst({ where: { id } });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: 'User not found',
        });
      }

      return user;
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

      const direccion = await this.address.findFirst({ where: { user } });

      if (direccion) {
        return {
          ...user,
          direccion,
        };
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { direccion, email, fullName, role, telefono } = updateUserDto;
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
          id,
          ...(direccion && {
            addresses: {
              updateMany: {
                where: { userId: id },
                data: {
                  address: direccion.address,
                  address2: direccion.address2 || null,
                  city: direccion.city,
                  zip: direccion.zip,
                },
              },
            },
          }),
          ...(telefono && { telefono }),
          ...(fullName && { fullName }),
          ...(email && { email }),
        },
      });

      return await this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 500,
        message: 'Revisar los logs del servidor',
      });
    }
  }

  async remove(id: number): Promise<RpcException> {
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
