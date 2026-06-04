import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { In, type Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) {}
    async create(createPermissionDto: CreatePermissionDto) {
        if (await this.findByName(createPermissionDto.name)) {
            throw new Error('权限名称已存在');
        }

        const permission =
            this.permissionRepository.create(createPermissionDto);
        return this.permissionRepository.save(permission);
    }

    // 创建超级管理员权限
    async createSuperAdmin() {
        // 判断超级管理员权限是否存在
        const existingPermission = await this.findOneByCode(
            process.env.SUPER_ADMIN_CODE,
        );

        if (existingPermission) {
            return existingPermission;
        }

        const permission = this.permissionRepository.create({
            code: process.env.SUPER_ADMIN_CODE,
            name: process.env.SUPER_ADMIN_NAME,
        });
        return this.permissionRepository.save(permission);
    }

    findAll() {
        return this.permissionRepository.find();
    }

    findByIds(ids: number[]) {
        return this.permissionRepository.findBy({
            id: In(ids),
        });
    }

    findOne(id: number) {
        return this.permissionRepository.findOneBy({ id });
    }

    // 根据权限名称查找权限
    findByName(name: string) {
        return this.permissionRepository.findOneBy({ name });
    }

    // 根据权限编码查找权限
    findOneByCode(code: string) {
        return this.permissionRepository.findOneBy({ code });
    }

    update(id: number, updatePermissionDto: UpdatePermissionDto) {
        return this.permissionRepository.update(id, updatePermissionDto);
    }

    remove(id: number) {
        return this.permissionRepository.delete(id);
    }
}
