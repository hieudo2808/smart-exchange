import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionCode } from "../constants/exception-code.constant";

export class AppException extends HttpException {
    constructor(
        codeKey: keyof typeof ExceptionCode,
        status?: HttpStatus,
        customMsg?: string
    ) {
        const { code, msg } = ExceptionCode[codeKey];
        super(
            {
                code,
                data: { message: customMsg || msg },
            },
            status || HttpStatus.BAD_REQUEST
        );
    }
}
