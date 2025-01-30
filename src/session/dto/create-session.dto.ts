import { Expose } from "class-transformer"
import { IsInt, IsNumber, IsString, Max, Min, min } from "class-validator"

export class CreateSessionDto {

    @Expose({ name: 'user_id' })
    @IsString()
    userId: string

    @Expose({ name: 'book_id' })
    @IsString()
    bookId: string

    @Expose({ name: 'start_page' })
    @IsNumber()
    @IsInt()
    @Min(1)
    @Max(4000)
    startPage: number

    @Expose({ name: 'end_page' })
    @IsNumber()
    @IsInt()
    @Min(1)
    @Max(4000)
    endPage: number
}