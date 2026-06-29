import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

// 全局守卫
import { GlobalGuard } from 'common/guards/global.guard';
import { PermissionGuard } from 'common/guards/permission.guard';
import { AuthGuard } from 'common/guards/auth.guard';

import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './modules/base/redis/redis.module';
import { PermissionModule } from './modules/base/permission/permission.module';
import { RoleModule } from './modules/base/role/role.module';
import { UserModule } from './modules/base/user/user.module';
import { MenuModule } from './modules/base/menu/menu.module';
import { AuthModule } from './modules/base/auth/auth.module';
import { TasksModule } from 'modules/base/tasks/tasks.module';
import { CaptchaModule } from './modules/base/captcha/captcha.module';
import { FilesModule } from 'modules/base/files/files.module';
import { SeedModule } from './seed/seed.module';
import { getUploadPath } from 'common/utils/upload';

@Module({
    imports: [
        // 全局变量配置
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
            isGlobal: true,
        }),
        // 数据库配置
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [],
            synchronize: process.env.NODE_ENV === 'development', // 生产环境请关闭
            autoLoadEntities: true,
        }),
        // 队列配置 redis
        BullModule.forRoot({
            prefix: 'XL-Lite',
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD,
            },
        }),

        // 配置静态资源
        ServeStaticModule.forRoot({
            rootPath: getUploadPath(),
            serveRoot: process.env.UPLOAD_BASE_PATH,
        }),

        ScheduleModule.forRoot(),

        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET,
        }),
        RedisModule,
        TasksModule,
        MenuModule,
        AuthModule,
        UserModule,
        RoleModule,
        PermissionModule,
        SeedModule,
        CaptchaModule,
        FilesModule,
    ],
    controllers: [AppController],
    providers: [
        AuthGuard,
        PermissionGuard,
        {
            provide: APP_GUARD, // 全局守卫
            useClass: GlobalGuard,
        },
    ], // 全局服务
})
export class AppModule {}
