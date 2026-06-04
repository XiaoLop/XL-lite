import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExecptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const responseObj = exception.getResponse();
        let message: string;
        let data: Record<string, any> | null = null;
        if (typeof responseObj === 'string') {
            message = responseObj;
        } else if (typeof responseObj === 'object' && responseObj !== null) {
            const respense = responseObj as {
                message: string | string[];
                data?: Record<string, any>;
            };
            message = Array.isArray(respense.message)
                ? respense.message.join(', ')
                : respense.message || 'Unknown error';
            data = respense.data ?? null;
        } else {
            message = 'Unknown error';
        }
        response.status(status).json({
            code: status,
            message,
            data,
        });
    }
}
