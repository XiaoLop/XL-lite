import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { hashPassword } from 'common/utils/password';
import { UserStatus } from './types/user.type';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly roleService: RoleService,
    ) {}
    async create(createUserDto: CreateUserDto) {
        // 根据角色ID查找角色
        const roles = await this.roleService.findByIds(createUserDto.roleIds);

        if (!roles || roles.length === 0) {
            throw new Error('角色列表不能为空');
        }

        createUserDto.password = await hashPassword(createUserDto.password);

        return this.userRepo.save({
            ...createUserDto,
            roles,
        });
    }

    // 创建超级管理员
    async createSuperAdmin() {
        // 当前系统中没有任何用户时，创建一个默认的超级管理员账号
        const count = await this.userRepo.count();
        if (count !== 0) return;

        const superAdminRole = await this.roleService.createSuperAdmin();
        const defaultSuperAdmin = {
            username: process.env.SUPER_ADMIN_NAME,
            email: `${process.env.SUPER_ADMIN_NAME}@qq.com`,
            password: await hashPassword(process.env.SUPER_ADMIN_PASSWORD),
            roles: [superAdminRole],
            status: UserStatus.Active,
        };

        return await this.userRepo.save(defaultSuperAdmin);
    }
    findAll() {
        return `This action returns all user`;
    }

    // 查找用户通过用户名或邮箱
    async findOneByUsername(username: string) {
        const user = await this.userRepo.findOne({
            where: [{ username }, { email: username }],
            relations: ['roles', 'roles.permissions'], // 关联角色和权限数据
            select: [
                'id',
                'username',
                'email',
                'password',
                'status',
                'created_at',
                'updated_at',
            ],
        });

        return user;
    }

    async getUserInfo(user: User) {
        return await this.userRepo.findOne({
            where: { id: user.id },
        });
    }

    // 查询用户权限
    async getUserPermissions(userId: number) {
        const userInfo = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions'],
        });

        if (!userInfo) {
            throw new Error('用户不存在');
        }

        return userInfo.roles.flatMap((role) =>
            role.permissions.map((perm) => perm.code),
        );
    }

    findOne(id: number) {
        return this.userRepo.findOne({
            where: { id },
            relations: ['roles', 'roles.permissions'],
        });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.userRepo.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.userRepo.delete(id);
    }
}
