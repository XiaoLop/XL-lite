import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { PermissionService } from 'modules/permission/permission.service';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private readonly permissionService: PermissionService,
    ) {}
    async create(createRoleDto: CreateRoleDto) {
        const permissions = await this.permissionService.findByIds(
            createRoleDto.permissionIds,
        );

        if (!permissions || permissions.length === 0) {
            throw new Error('权限列表不能为空');
        }

        return this.roleRepository.save({
            ...createRoleDto,
            permissions,
        });
    }

    // 创建超级管理员角色
    async createSuperAdmin() {
        // 判断超级管理员角色是否存在
        const existingRole = await this.roleRepository.findOneBy({
            code: 'super_admin',
        });

        if (existingRole) {
            return existingRole;
        }

        const role = this.roleRepository.create({
            code: 'super_admin',
            name: 'super_admin',
            permissions: [await this.permissionService.createSuperAdmin()],
        });

        return await this.roleRepository.save(role);
    }

    findAll() {
        return `This action returns all role`;
    }

    findOne(id: number) {
        return this.roleRepository.findOneBy({ id });
    }

    // 根据Ids 查找角色
    findByIds(ids: number[]) {
        return this.roleRepository.findBy({
            id: In(ids),
        });
    }

    // 查找角色的权限
    findRolePermissions(id: number) {
        return this.roleRepository.findOne({
            where: { id },
            relations: ['permissions'],
        });
    }
    update(id: number, updateRoleDto: UpdateRoleDto) {
        return this.roleRepository.update(id, updateRoleDto);
    }

    remove(id: number) {
        return this.roleRepository.delete(id);
    }
}
