import { Expose, Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateBookDto {

    @IsString()
    name: string

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(4000)
    @Expose({ name: 'number_of_pages' })
    numberOfPages: number
}