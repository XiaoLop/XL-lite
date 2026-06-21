import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './types/menu.type';
import menusData from './data/menus.data';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepo: Repository<Menu>,
    ) {}

    /**
     * 创建菜单
     * @param createMenuDto
     * @returns
     */
    create(createMenuDto: CreateMenuDto) {
        return this.menuRepo.save(createMenuDto);
    }

    /**
     * 查询所有菜单
     * @returns
     */
    findAll() {
        return this.menuRepo.find();
    }

    /**
     * 查询活跃菜单
     * @returns
     */
    findActiveMenus() {
        return this.menuRepo.findBy({ status: true });
    }

    /**
     * 查询单个菜单
     * @param id
     * @returns
     */
    findOne(id: number) {
        return this.menuRepo.findOneBy({ id });
    }

    /**
     * 更新菜单
     * @param id
     * @param updateMenuDto
     * @returns
     */
    update(id: number, updateMenuDto: UpdateMenuDto) {
        return this.menuRepo.update(id, updateMenuDto);
    }

    /**
     * 删除菜单
     * @param id
     * @returns
     */
    async remove(id: number) {
        await this.menuRepo.delete(id);
    }

    /**
     * 创建初始菜单
     */
    async createInitMenu() {
        const menus: MenuItem[] = menusData;

        // 判断是否有菜单
        const existingMenus = await this.findAll();
        if (existingMenus.length > 0) {
            return;
        }
        const createChildren = async (menus: MenuItem[], parentId: number) => {
            for (const menu of menus) {
                const menuData = {
                    ...menu,
                    parent_id: parentId,
                };
                const parentMenu = await this.create(menuData);
                if (menu.children && menu.children.length > 0) {
                    await createChildren(menu.children, parentMenu.id);
                }
            }
        };
        await createChildren(menus, 0);
    }
}
