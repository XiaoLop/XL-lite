export interface AccessJwtPayload {
    sub: number; // 用户ID
    username: string;
    email: string;
    permissions: string[];
}

export interface RefreshJwtPayload {
    sub: number; // 用户ID
    username: string;
    email: string;
}
