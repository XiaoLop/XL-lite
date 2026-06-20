import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResult } from 'common/decorators/api-result.decorator';
import { UserInfoDto } from './dto/user-info.dto';
import { ApiOperation } from '@nestjs/swagger';
import type { AccessJwtPayload } from 'modules/auth/types/auth.type';

interface RequestWithUser extends Request {
    user: AccessJwtPayload;
}

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
