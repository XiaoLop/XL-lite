declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // 数据配置
            DB_TYPE:
                | 'mysql'
                | 'postgres'
                | 'sqlite'
                | 'mongodb'
                | 'mssql'
                | 'oracle'
                | 'cockroachdb'
                | 'better-sqlite3';
            DB_HOST: string;
            DB_PORT: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_DATABASE: string;

            // Redis配置
            REDIS_HOST: string;
            REDIS_PORT: string;
            REDIS_PASSWORD: string;

            // JWT配置
            JWT_REFRESH_SECRET: string;
            JWT_REFRESH_EXPIRATION: string;
            JWT_ACCESS_SECRET: string;
            JWT_ACCESS_EXPIRATION: string;

            // 端口配置
            PORT: string;

            // 环境配置
            NODE_ENV: 'development' | 'production' | 'test';

            // 密钥配置
            HASH_KEY: string; // 用于密码加密的密钥

            // upload
            UPLOAD_CACHE_PATH: string;
            UPLOAD_BASE_PATH: string;

            // 超级管理员配置
            SUPER_ADMIN_CODE: string; // 超级管理员的权限标识
            SUPER_ADMIN_NAME: string; // 超级管理员的用户名
            SUPER_ADMIN_PASSWORD: string; // 超级管理员的密码
        }
    }
}

export {};
