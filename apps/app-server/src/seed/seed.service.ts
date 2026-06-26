import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { MenuService } from 'modules/base/menu/menu.service';
import { UserService } from 'modules/base/user/user.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);
    constructor(
        private readonly userService: UserService,
        private readonly menuService: MenuService,
    ) {}

    async onApplicationBootstrap() {
        this.logger.log('初始化种子数据...');
        // 创建超级管理员
        await this.userService.createSuperAdmin();
        // 创建初始菜单
        await this.menuService.createInitMenu();
        this.logger.log('种子数据初始化完成');
    }
}
