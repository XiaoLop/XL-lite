import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MenuType } from '../types/menu.type';

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        nullable: true,
    })
    path!: string;

    @Column({
        nullable: true, /// 可为空
    })
    component!: string; // 组件路径

    @Column({
        nullable: true,
    })
    permission_code!: string; // 权限字符串

    @Column({
        default: 0,
    })
    sort!: number;

    @Column()
    type!: MenuType;

    @Column({
        default: 0,
    })
    parent_id?: number; // 父级id

    @Column({
        nullable: true,
    })
    icon!: string;

    @Column({
        default: true,
    })
    status!: boolean; // 状态 false 禁用 true 启用
}
