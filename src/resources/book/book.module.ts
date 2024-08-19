import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [BookController],
  providers: [BookService, AuthService, UserService],
})
export class BookModule {}
