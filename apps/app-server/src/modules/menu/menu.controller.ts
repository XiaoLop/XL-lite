import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResult } from 'common/decorators/api-result.decorator';
import { FindMenuDto } from './dto/find-menu.dto';
import { Permission } from 'common/decorators/permission.decorator';

@Permission('menu')
@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @ApiOperation({ summary: '创建菜单' })
    @ApiBody({
        type: CreateMenuDto,
    })
    @Post()
    create(@Body() createMenuDto: CreateMenuDto) {
        return this.menuService.create(createMenuDto);
    }

    @ApiOperation({ summary: '获取所有菜单' })
    @ApiResult({
        type: [FindMenuDto],
    })
    @Get('all')
    findAllBy() {
        return this.menuService.findActiveMenus();
    }

    @ApiOperation({ summary: '查询所有菜单' })
    @ApiResult({
        type: [FindMenuDto],
    })
    @Get()
    findAll() {
        return this.menuService.findAll();
    }

    @ApiOperation({ summary: '查询指定菜单' })
    @ApiResult({
        type: FindMenuDto,
    })
    @ApiParam({
        name: 'id',
        required: true, // 是否必填
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuService.findOne(+id);
    }

    @ApiOperation({ summary: '更新指定菜单' })
    @ApiParam({
        name: 'id',
        required: true, // 是否必填
    })
    @ApiBody({
        type: UpdateMenuDto,
    })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menuService.update(+id, updateMenuDto);
    }

    @ApiOperation({ summary: '删除指定菜单' })
    @ApiParam({
        name: 'id',
        required: true, // 是否必填
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuService.remove(+id);
    }
}
