import {
    Body,
    Controller,
    Post,
    Logger,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

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
    async login(@Body() body: LoginDto) {
        const result = await this.authService.login(body);

        return { accessToken: result.accessToken };
    }
}
