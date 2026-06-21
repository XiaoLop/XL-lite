import {
    Body,
    Controller,
    Post,
    Logger,
    ValidationPipe,
    UsePipes,
    Get,
    Req,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { LoginDto, LoginResultDto } from './dto/login.dto';
import { Public } from 'common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiResult } from 'common/decorators/api-result.decorator';
import type { User } from 'modules/user/entities/user.entity';
import { safeEval } from 'common/utils/tools';

interface RequestWithUser extends Request {
    user: User;
}

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @ApiOperation({
        summary: '用户登录',
    })
    @ApiBody({ type: LoginDto }) // 接口参数
    @ApiResult({
        type: LoginResultDto,
    })
    @UsePipes(new ValidationPipe()) // 验证参数
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        const result = await this.authService.login(body);

        // 将 Refresh Token 设置为 HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: safeEval(process.env.JWT_REFRESH_EXPIRATION) * 1000, // 7 天
        });

        return { accessToken: result.accessToken };
    }

    @Post('refresh')
    @Public()
    @ApiOperation({
        summary: '刷新 Access Token',
    })
    @ApiResult({
        type: String,
    })
    async refresh(
        @Req() req: express.Request,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        // 从 Cookie 中获取 Refresh Token
        const refreshToken = req.cookies['refreshToken'] as string;
        if (!refreshToken) {
            throw new HttpException(
                {
                    message: 'refreshToken is required',
                    data: null,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        try {
            const newAccessToken = await this.authService.refresh(refreshToken);
            return newAccessToken;
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

    @Post('logout')
    @Public()
    @ApiOperation({
        summary: '退出登录',
    })
    logout(@Res({ passthrough: true }) res: express.Response) {
        res.clearCookie('refreshToken');
        return { message: '退出成功' };
    }

    @Get('codes')
    @ApiOperation({
        summary: '获取用户权限码',
    })
    @ApiResult({
        type: [String],
    })
    async getCodes(@Req() req: RequestWithUser) {
        return await this.authService.getCodes(req.user.id);
    }
}
