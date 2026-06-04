import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExecptionFilter } from './common/filters/http-execption.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // 设置全局路由前缀
    app.use(cookieParser());

    app.useGlobalInterceptors(new ResponseInterceptor()); // 全局响应拦截器
    app.useGlobalFilters(new HttpExecptionFilter()); // 全局异常过滤器

    if (process.env.NODE_ENV === 'development') {
        const config = new DocumentBuilder()
            .setTitle('XL Lite API')
            .setDescription('XL Lite 接口文档')
            .setVersion('1.0') // 文档版本
            .addTag('XL') // 添加标签
            .build();

        const documentFactory = () => SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('/doc', app, documentFactory, {
            jsonDocumentUrl: '/doc/json',
        }); // 设置路由前缀
    }

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
