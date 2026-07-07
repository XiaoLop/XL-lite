import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiResult } from 'common/decorators/api-result.decorator';
import { UserInfoDto } from './dto/user-info.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { AccessJwtPayload } from 'modules/base/auth/types/auth.type';

interface RequestWithUser extends Request {
    user: AccessJwtPayload;
}

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 根据Token获取用户信息
    @Get('info')
    @ApiOperation({
        summary: '获取用户信息',
    })
    @ApiResult({
        type: UserInfoDto,
    })
    async getUserInfo(@Req() req: RequestWithUser): Promise<UserInfoDto> {
        return await this.userService.getUserInfo(req.user.sub);
    }

    // 更新个人基本信息
    @Put('profile')
    @ApiOperation({ summary: '更新个人基本信息' })
    @ApiResult({ type: UserInfoDto })
    async updateProfile(
        @Req() req: RequestWithUser,
        @Body() dto: UpdateProfileDto,
    ): Promise<UserInfoDto> {
        return await this.userService.updateProfile(req.user.sub, dto);
    }

    // 修改密码
    @Put('password')
    @ApiOperation({ summary: '修改密码' })
    async changePassword(
        @Req() req: RequestWithUser,
        @Body() dto: ChangePasswordDto,
    ): Promise<void> {
        return await this.userService.changePassword(req.user.sub, dto);
    }

    // 更新头像
    @Put('avatar')
    @ApiOperation({ summary: '更新头像' })
    @ApiResult({ type: UserInfoDto })
    async updateAvatar(
        @Req() req: RequestWithUser,
        @Body('avatar') avatar: string,
    ): Promise<UserInfoDto> {
        return await this.userService.updateAvatar(req.user.sub, avatar);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
