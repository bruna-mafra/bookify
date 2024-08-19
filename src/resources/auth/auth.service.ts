import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { config } from 'dotenv';
import { UserService } from '../user/user.service';

config();
@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    this.prisma = new PrismaClient();
  }

  async signIn(email: string, pass: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
        select: {
          userId: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User credentials do not match');
      }

      let isPasswordValid;
      if (pass === user.password) {
        isPasswordValid = true;
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException('User credentials do not match');
      }

      const payload = {
        id: user.userId,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: process.env.TOKEN_EXPIRES_IN,
        }),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error signing in.');
      }
    }
  }

  async extractTokenFromHeader(
    request: FastifyRequest | { headers: { authorization?: string } },
  ) {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async extractuserId(token: string) {
    try {
      const { id } = await this.jwtService.verify(token);
      return id;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
