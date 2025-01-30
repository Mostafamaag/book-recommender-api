import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateSessionDto } from '../session/dto/create-session.dto';

@Controller('book')
export class BookController {
    private logger = new Logger('SessionController');

    constructor(
        private readonly bookService: BookService,
    ) { }

    @Get('/top-5')
    async getTopBooks() {
        const topBooks = await this.bookService.getTopBooks();
        return topBooks;
    }

    @Get('/:id')
    async getBookById(@Param('id') id: number): Promise<Book> {
        return this.bookService.getBookById(id);
    }

    @Post('add-session')
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async addBookSession(@GetUser() user: User, @Body() createSessionDto: CreateSessionDto) {
        this.logger.verbose(`user: ${user.name} adding new session`);
        return this.bookService.addBookSession(user, createSessionDto);
    }


    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async addNewBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.bookService.addNewBook(createBookDto);
    }

    @Put('/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateBook(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
        return this.bookService.updateBook(id, updateBookDto);
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async deleteBook(@Param('id') id: number): Promise<void> {
        return this.bookService.deleteBook(id);
    }
}
