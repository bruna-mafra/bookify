import { Body, Controller, Post, UsePipes, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import {
  AuthenticateUser,
  authenticateUserSchema,
} from './dto/authenticate-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserSchema))
  async signIn(@Res() reply: FastifyReply, @Body() body: AuthenticateUser) {
    try {
      const token = await this.authService.signIn(body.email, body.password);
      return reply.status(200).send(token);
    } catch (error) {
      console.log(error);
    }
  }
}
