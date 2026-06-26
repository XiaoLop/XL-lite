/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccessJwtPayload } from 'modules/base/auth/types/auth.type';

declare namespace Express {
    export interface Request {
        user?: AccessJwtPayload; // 可选的 user 属性
    }
}

export {};
