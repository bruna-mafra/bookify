import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Delete,
  UsePipes,
  Req,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ReviewService } from './review.service';
import { createReviewDto, createReviewSchema } from './dto/create-review.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
// import { AuthGuard } from '../guards/http.guard';
import { AuthService } from '../auth/auth.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly authService: AuthService,
  ) {}

  // Rota que cria uma nova avaliação
  // @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createReviewSchema))
  create(@Body() body: createReviewDto, @Res() reply: FastifyReply) {
    const review = this.reviewService.create(body);
    if (review) {
      reply.status(201).send(review);
    }
  }

  // Rota que busca todas avaliações vinculadas a um livro
  // @UseGuards(AuthGuard)
  @Get('books/:id')
  async getAllReviews(@Param('id') bookId: string, @Res() reply: FastifyReply) {
    const reviews = this.reviewService.findAllByBook(bookId);
    if (reviews) {
      reply.status(200).send(reviews);
    }
  }

  // Rota que busca uma avaliação específica
  // @UseGuards(AuthGuard)
  @Get(':id')
  async getReview(@Param('id') reviewId: string, @Res() reply: FastifyReply) {
    const userId = 'teste';
    const review = this.reviewService.findOne(reviewId, userId);
    if (review) {
      reply.status(200).send(review);
    }
  }

  // Rota que deleta uma avaliação pelo ID
  // @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteReview(
    @Param('id') reviewId: string,
    @Res() reply: FastifyReply,
    @Req() request: FastifyRequest,
  ) {
    const token = await this.authService.extractTokenFromHeader(request);
    const userId = await this.authService.extractuserId(token);
    const review = this.reviewService.remove(reviewId, userId);
    if (review) {
      reply.status(200).send({ message: 'review deleted.' });
    }
  }
}
