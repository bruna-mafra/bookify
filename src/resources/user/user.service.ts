import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createUserDto } from './dto/create-user.dto';
import { partialUpdateUserDto } from './dto/partial-update-user-dto';

@Injectable()
export class UserService {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: createUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          cpf: user.cpf,
          status: true,
          city: user.city,
          state: user.state,
        },
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          state: true,
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(userId: string) {
    try {
      const user = await this.verifyUserExistence(userId);
      if (user) {
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();

      if (!users || users.length === 0) {
        throw new NotFoundException('Users not found');
      }
      console.log(users);
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new Error('An unexpected error occurred while fetching users');
      }
    }
  }

  async update(userId: string, data: partialUpdateUserDto) {
    try {
      const existingUser = this.verifyUserExistence(userId);
      if (!existingUser) {
        throw new NotFoundException();
      }

      const user = await this.prisma.user.update({
        where: {
          userId,
        },
        data,
      });

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
      }
    }
  }

  async remove(userId: string) {
    try {
      const existingUser = this.verifyUserExistence(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const user = await this.prisma.user.delete({
        where: {
          userId: userId,
        },
      });
      if (user) {
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  private async verifyUserExistence(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      return false;
    } else return true;
  }

  async calculateAverageRating(bookId: string): Promise<number | null> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          bookId,
        },
        select: {
          rating: true,
        },
      });

      if (reviews.length === 0) {
        return null;
      }

      const sumOfRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = sumOfRatings / reviews.length;

      return averageRating;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to calculate average rating.',
      );
    }
  }
}
