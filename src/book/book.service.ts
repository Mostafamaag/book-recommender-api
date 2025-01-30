import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { SessionService } from '../session/session.service';
import { User } from '../user/entities/user.entity';
import { CreateSessionDto } from '../session/dto/create-session.dto';

@Injectable()
export class BookService {

    constructor(
        private readonly bookRepository: BookRepository,
        private readonly sessionService: SessionService
    ) { }

    async getAllBooks(): Promise<Book[]> {
        const books = await this.bookRepository.findAll();
        return books;
    }

    async getTopBooks() {

        const sessions = await this.sessionService.getAllSessions();
        const pagesCount = this.getPagesCount(sessions);

        const top5Books = await this.getTop5Books(pagesCount);

        return top5Books;

    }


    async addBookSession(user: User, createSessionDto: CreateSessionDto) {
        const { userId, bookId, startPage, endPage } = createSessionDto;

        const book = await this.getBookById(+bookId);

        return await this.sessionService.addSession(user, book, startPage, endPage);
    }

    async getBookById(id: number): Promise<Book> {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new NotFoundException("Book not found");
        }
        return book;
    }

    async addNewBook(createBookDto: CreateBookDto): Promise<Book> {
        const { name, numberOfPages } = createBookDto;

        const newBook = new Book(name, numberOfPages)
        await this.bookRepository.save(newBook);

        return newBook;
    }

    async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        let existingBook = await this.getBookById(id);
        await this.bookRepository.update(id, updateBookDto);

        //update book to avoid refetching it again
        Object.keys(updateBookDto).forEach((key) => {
            if (updateBookDto[key] !== undefined) {
                existingBook[key] = updateBookDto[key];
            }
        });

        return existingBook;
    }

    async deleteBook(id: number): Promise<void> {
        const bookToDelete = await this.getBookById(id);
        await this.bookRepository.delete(bookToDelete);
    }


    async getTop5Books(pagesCount: {}) {
        const topBooks = Object.keys(pagesCount).map(key => ({
            id: key,
            number_of_read_pages: pagesCount[key].count
        }));

        topBooks.sort((a, b) => +b.number_of_read_pages - +a.number_of_read_pages);

        const top5Books = topBooks.slice(0, 5);
        const ids = top5Books.map(book => +book.id);
        const books = await this.bookRepository.getTopBooks(ids);

        return top5Books.map((topBook) => {
            const book = books.find(b => b.id === +topBook.id);
            return {
                book_id: topBook.id,
                book_name: book.name,
                num_of_pages: book.numberOfPages.toString(),
                num_of_read_pages: topBook.number_of_read_pages.toString()
            };
        });
    }

    getPagesCount(sessions) {
        const pagesCount = {};

        for (let session of sessions) {
            const { startPage, endPage, bookId } = session;

            if (!pagesCount[bookId]) {
                pagesCount[bookId] = {
                    startInterval: startPage,
                    endInterval: endPage,
                    count: 0
                }
            }

            else {

                if (pagesCount[bookId].endInterval < startPage) {
                    pagesCount[bookId].count += pagesCount[bookId].endInterval - pagesCount[bookId].startInterval;
                    pagesCount[bookId].startInterval = startPage
                    pagesCount[bookId].endInterval = endPage

                } else {
                    pagesCount[bookId].endInterval = Math.max(pagesCount[bookId].endInterval, pagesCount[bookId].startInterval);
                }

            }
        }
        for (const book in pagesCount) {
            pagesCount[book].count += pagesCount[book].endInterval - pagesCount[book].startInterval;
            delete pagesCount[book].endInterval;
            delete pagesCount[book].startInterval;
        }
        return pagesCount;
    }


    // Eager loading book with sessions
    // merging intervals and calculate the total pages for every book
    getPagesCountEager(books: Book[]) {
        const pagesCount = {};

        for (const book of books) {
            if (book.sessions.length === 0) continue;

            let startInterval = null;
            let endInterval = null;
            let count = 0;

            for (let session of book.sessions) {
                const startPage = session.startPage;
                const endPage = session.endPage;

                if (startInterval === null && endInterval === null) {
                    startInterval = startPage;
                    endInterval = endPage;
                }

                else {

                    if (endInterval < startPage) {
                        count += endInterval - startInterval;
                        startInterval = startPage
                        endInterval = endPage

                    } else {
                        endInterval = Math.max(endInterval, endPage);
                    }

                }
            }
            count += endInterval - startInterval;
            pagesCount[book.id] = count;
            book.sessions = null;
        }

        return pagesCount;
    }

}
