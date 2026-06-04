import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { CommonResponseDto } from '../dto/common.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: T) => {
                const response = context.switchToHttp().getResponse<Response>();
                const code = response.statusCode;
                return new CommonResponseDto<T>(code, 'OK', data);
            }),
        );
    }
}
