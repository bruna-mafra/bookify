import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewService {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: any) {
    try {
      const newBook = await this.prisma.review.create({
        data,
      });
      return newBook;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(bookId: string, userId: string) {
    try {
      const review = await this.verifyReviewExistence(bookId, userId);
      if (review) {
        return review;
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

  async findAllByBook(bookId: string) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          bookId,
        },
      });

      if (!reviews) {
        throw new NotFoundException('Reviews not found');
      }
      return reviews;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(reviewId: string, userId: string) {
    try {
      const existingReview = this.verifyReviewExistence(reviewId, userId);
      if (!existingReview) {
        throw new NotFoundException('Review not found');
      }
      const review = await this.prisma.review.delete({
        where: {
          reviewId: reviewId,
        },
      });
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }

  private async verifyReviewExistence(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        reviewId,
        userId,
      },
    });
    if (!review) {
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
