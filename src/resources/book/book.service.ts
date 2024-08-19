import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewService } from '../reviews/review.service';
import { createBookDto } from './dto/create-book.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookService {
  public prisma: PrismaClient;
  private reviewService: ReviewService;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: createBookDto, ownerId: string) {
    try {
      // Dentro do método create no book.service.ts
      const newBook = await this.prisma.book.create({
        data: {
          title: data.title,
          author: data.author,
          publisher: data.publisher,
          ownerId: ownerId,
          description: data.description,
          category: data.category,
        },
      });
      return newBook;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(bookId: string) {
    try {
      const bookExists = await this.verifyBookExistence(bookId);
      if (bookExists) {
        const book = this.prisma.book.findUnique({
          where: {
            bookId,
          },
        });
        return book;
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

  async findAll() {
    try {
      const books = await this.prisma.book.findMany();

      if (!books) {
        throw new NotFoundException('Books not found');
      }
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findAllAvaiable() {
    try {
      const books = await this.prisma.book.findMany({
        where: {
          status: true,
        },
      });

      if (!books) {
        throw new NotFoundException('Books not found');
      }
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findLocados(userId: string) {
    const emprestimos = await this.prisma.loan.findMany({
      where: {
        renterId: userId,
      },
      select: {
        bookId: true,
      },
    });

    return emprestimos;
  }

  async findEmprestados(userId: string) {
    const emprestimos = await this.prisma.loan.findMany({
      where: {
        lenderId: userId,
      },
      select: {
        bookId: true,
      },
    });

    return emprestimos;
  }

  async update(bookId: string, data: any) {
    try {
      const existingBook = this.verifyBookExistence(bookId);
      if (!existingBook) {
        throw new NotFoundException('Book not found');
      }
      const book = await this.prisma.book.update({
        where: {
          bookId,
        },
        data,
      });

      return book;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(bookId: string) {
    try {
      const existingBook = this.verifyBookExistence(bookId);
      if (!existingBook) {
        throw new NotFoundException('Book not found');
      }
      await this.prisma.book.delete({
        where: {
          bookId,
        },
      });
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else console.log(error);
    }
  }

  private async verifyBookExistence(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        bookId,
      },
    });
    if (!book) {
      return false;
    } else return true;
  }

  async getAverageRating(bookId: string): Promise<number | null> {
    return this.reviewService.calculateAverageRating(bookId);
  }
}
