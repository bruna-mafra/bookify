import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Delete,
  UsePipes,
  Patch,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createBookDto, createBookSchema } from './dto/create-book.dto';
import { updateBookDto, updateBookSchema } from './dto/update-book.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { AuthService } from '../auth/auth.service';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly authService: AuthService,
  ) {}

  // Rota que cria um novo livro
  @Post()
  @UsePipes(new ZodValidationPipe(createBookSchema))
  async create(
    @Body() body: createBookDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const token = await this.authService.extractTokenFromHeader(request);
    const userId = await this.authService.extractuserId(token);

    const book = this.bookService.create(body, userId);
    if (book) {
      reply.status(201).send(book);
    }
  }

  // Rota que busca todos os livros cadastrados
  @Get()
  async getAllBooks(@Res() reply: FastifyReply) {
    const books = await this.bookService.findAll();
    if (books) {
      reply.status(200).send(books);
    }
  }

  @Get('avaiable')
  async getAllAvaiableBooks(@Res() reply: FastifyReply) {
    const books = await this.bookService.findAllAvaiable();
    if (books) {
      reply.status(200).send(books);
    }
  }

  @Get('emprestados')
  async getLendedBooks(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const token = await this.authService.extractTokenFromHeader(request);
    const userId = await this.authService.extractuserId(token);

    const books = await this.bookService.findEmprestados(userId);
    if (books) {
      reply.status(200).send(books);
    }
  }

  @Get(':id')
  async getBook(
    @Req() request: FastifyRequest,
    @Param('id') bookId: string,
    @Res() reply: FastifyReply,
  ) {
    const book = await this.bookService.findOne(bookId);
    if (book) {
      reply.status(200).send(book);
    }
  }

  // Rota que exclui um livro pelo ID
  @Delete(':id')
  async deleteBook(@Param('id') bookId: string, @Res() reply: FastifyReply) {
    const book = this.bookService.remove(bookId);
    if (book) {
      reply.status(200).send({ message: 'book deleted.' });
    }
  }

  // Rota que atualiza parcialmente os dados de um livro
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateBookSchema))
  async partialUpdate(
    @Param('id') bookId: string,
    @Res() reply: FastifyReply,
    @Body() data: updateBookDto,
  ) {
    const book = await this.bookService.update(bookId, data);
    if (book) {
      reply.status(200).send({ message: 'book updated.' });
    }
  }

  @Get(':id/rating')
  async getAverageRating(
    @Param('id') bookId: string,
    @Res() reply: FastifyReply,
  ) {
    const averageRating = await this.bookService.getAverageRating(bookId);
    if (averageRating !== null) {
      reply.status(200).send({ averageRating });
    } else {
      reply.status(404).send({ message: 'No ratings found for this book.' });
    }
  }
}
