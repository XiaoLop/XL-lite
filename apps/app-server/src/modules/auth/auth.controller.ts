import {
    Body,
    Controller,
    Post,
    Res,
    Req,
    Logger,
    ValidationPipe,
    UsePipes,
    HttpException,
    HttpStatus,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'common/decorators/public.decorator';
import express from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { safeEval } from 'common/utils/tools';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @ApiOperation({
        summary: '用户登录',
    })
    @ApiBody({ type: LoginDto })
    @UsePipes(new ValidationPipe())
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        const result = await this.authService.login(body);

        // 将 Refresh Token 设置为 HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: safeEval(process.env.JWT_REFRESH_EXPIRATION), // 7 天
        });

        return { accessToken: result.accessToken };
    }

    @Get('refresh')
    @Public()
    @ApiOperation({
        summary: '刷新 Access Token',
    })
    async refresh(
        @Req() req: express.Request,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        // 从 Cookie 中获取 Refresh Token
        const refreshToken = req.cookies['refreshToken'] as string;
        if (!refreshToken) {
            return { accessToken: null };
        }

        try {
            const newAccessToken = await this.authService.refresh(refreshToken);
            return { accessToken: newAccessToken };
        } catch (error) {
            this.logger.error(error);
            // 刷新失败，清除 Refresh Token Cookie
            res.clearCookie('refreshToken');
            if (error instanceof Error) {
                throw new HttpException(
                    {
                        message: error.message,
                        data: {
                            code: 20001,
                        },
                    },
                    HttpStatus.UNAUTHORIZED,
                );
            }
        }
    }
}
