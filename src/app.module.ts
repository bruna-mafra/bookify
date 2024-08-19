import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { BookModule } from './resources/book/book.module';
import { ReviewModule } from './resources/reviews/review.module';
import { AuthModule } from './resources/auth/auth.module';

@Module({
  imports: [UserModule, BookModule, ReviewModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
