import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, AuthService, UserService],
})
export class ReviewModule {}
