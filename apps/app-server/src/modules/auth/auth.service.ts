import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { comparePassword } from 'common/utils/password';
import { CaptchaService } from 'modules/captcha/captcha.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload, RefreshJwtPayload } from './types/auth.type';
import { safeEval } from 'common/utils/tools';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly captchaService: CaptchaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(data: LoginDto) {
        // 验证验证码
        await this.captchaService.validateCaptcha(data.captchaId, data.captcha);

        // 验证用户身份
        const user = await this.validateUser(data.username, data.password);

        // 生成长效的 Refresh Token 和短效的 Access Token
        const refreshToken = this.generateRefreshToken({
            sub: user.id,
            username: user.username,
            email: user.email,
        });

        const accessToken = this.generateAccessToken({
            sub: user.id,
            username: user.username,
            email: user.email,
            permissions: user.roles.flatMap((role) =>
                role.permissions.map((perm) => perm.code),
            ),
        });
        return { refreshToken, accessToken };
    }

    // 验证用户身份
    async validateUser(username: string, password: string) {
        const user = await this.userService.findOneByUsername(username);
        if (!user) {
            throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
        }

        if (!(await comparePassword(password, user.password))) {
            throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    // 获取用户权限码
    async getCodes(userId: number) {
        return await this.userService.getUserPermissions(userId);
    }

    // 刷新 Access Token
    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify<RefreshJwtPayload>(
            refreshToken,
            {
                secret: process.env.JWT_REFRESH_SECRET,
            },
        );
        const user = await this.userService.findOne(payload.sub);
        if (!user) {
            throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
        }
        return this.generateAccessToken({
            sub: user.id,
            username: user.username,
            email: user.email,
            permissions: user.roles.flatMap((role) =>
                role.permissions.map((perm) => perm.code),
            ),
        });
    }

    // 生成 Refresh Token
    generateRefreshToken(payload: RefreshJwtPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: safeEval(process.env.JWT_REFRESH_EXPIRATION), // Refresh Token 有效期长
        });
    }

    // 生成 Access Token
    generateAccessToken(payload: AccessJwtPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: safeEval(process.env.JWT_ACCESS_EXPIRATION), // Access Token 有效期短
        });
    }
}
