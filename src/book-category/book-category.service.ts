import { Injectable } from '@nestjs/common';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService {
  constructor(
    @InjectRepository(BookCategory)
    private repo: Repository<BookCategory>,
  ) {}
  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      console.log('Seeding Book Categories...');
      await this.repo.save([
        { name: 'Fiction', description: 'Stories and novels' },
        { name: 'Technology', description: 'Computers and engineering' },
        { name: 'History', description: 'Past events' },
      ]);
    }
  }

  create(createBookCategoryDto: CreateBookCategoryDto) {
    return this.repo.save(createBookCategoryDto);
  }

  findAll() {
    return this.repo.find();
  }
  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  update(id: string, updateBookCategoryDto: UpdateBookCategoryDto) {
    return this.repo.update(id, updateBookCategoryDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
