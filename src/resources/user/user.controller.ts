import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FastifyReply } from 'fastify';
import { createUserDto, createUserSchema } from './dto/create-user.dto';
import {
  partialUpdateUserDto,
  partialUpdateUserSchema,
} from './dto/partial-update-user-dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Rota de criação de um novo usuário
  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() user: createUserDto, @Res() reply: FastifyReply) {
    const newUser = await this.userService.create(user);
    if (newUser) {
      return reply.status(201).send(newUser);
    }
  }

  //Rota que altera os dados de um usuário pelo ID
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(partialUpdateUserSchema))
  async partialUpdate(
    @Param('id') userId: string,
    @Res() reply: FastifyReply,
    @Body() data: partialUpdateUserDto,
  ) {
    const user = await this.userService.update(userId, data);
    if (user) {
      reply.status(200).send({ message: 'user updated.' });
    }
  }

  //Rota que deleta um usuário pelo ID
  @Delete(':id')
  async deleteUser(@Param('id') userId: string, @Res() reply: FastifyReply) {
    const user = await this.userService.remove(userId);
    if (user) {
      reply.status(200).send({ message: 'user deleted.' });
    }
  }

  // Rota que busca todos os usuários cadastrados
  @Get()
  async getAllUsers(@Res() reply: FastifyReply) {
    const users = await this.userService.findAll();

    reply.status(200).send(users);
  }

  //Rota que busca um usuário pelo ID
  @Get(':id')
  async getUser(@Param('id') userId: string, @Res() reply: FastifyReply) {
    const user = this.userService.findOne(userId);
    if (user) {
      reply.status(200).send(user);
    }
  }
}
