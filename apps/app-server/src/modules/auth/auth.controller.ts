import {
    Body,
    Controller,
    Post,
    Logger,
    ValidationPipe,
    UsePipes,
    Get,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResultDto } from './dto/login.dto';
import { Public } from 'common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiResult } from 'common/decorators/api-result.decorator';
import type { User } from 'modules/user/entities/user.entity';

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
    async login(@Body() body: LoginDto) {
        const result = await this.authService.login(body);

        return { accessToken: result.accessToken };
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
