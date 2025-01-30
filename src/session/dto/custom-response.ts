
export class CustomResponse {
    constructor(status_code: string, message?: string) {
        this.status_code = status_code;
        this.message = message;
    }

    status_code: string;
    message?: string;

}
