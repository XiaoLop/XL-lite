import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(
        @Inject('XL-CLIENT-REDIS') private readonly redisClient: Redis,
    ) {}

    async set(key: string, value: string, expire?: number): Promise<void> {
        if (expire) {
            await this.redisClient.set(key, value, 'EX', expire);
        } else {
            await this.redisClient.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
