import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookRepository.save(createBookDto);
  }

  findAll() {
    return this.bookRepository.find({
      relations: ['category'],
    });
  }

  findOne(id: string) {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async incrementLikes(id: string) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    book.likeCount += 1;
    return this.bookRepository.save(book);
  }

  async toggleLike(bookId: string, userId: string) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'], 
    });
    console.log(book);
    if (!book) throw new NotFoundException('Book not found');

    const userIndex = book.likedBy.findIndex(user => user.id === userId);

    if (userIndex >= 0) {
      book.likedBy.splice(userIndex, 1);
      book.likeCount = Math.max(0, book.likeCount - 1);
    } else {
      const user = new User();
      user.id = userId;
      book.likedBy.push(user);
      book.likeCount += 1;
    }

    return this.bookRepository.save(book);
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }
}
