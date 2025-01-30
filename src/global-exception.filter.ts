import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { QueryFailedError } from "typeorm";
import { Response } from 'express';
import { Logger } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private logger = new Logger('GlobalExceptionFilter');

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = 500;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }

        this.logger.error({ exception });
        this.logger.error(exception.stack);

        response.status(status).json({
            statusCode: status,
            message: message,
        });
    }
}