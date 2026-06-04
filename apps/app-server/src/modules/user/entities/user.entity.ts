import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserStatus } from '../types/user.type';
import { Role } from 'modules/role/entities/role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column()
    email!: string;

    @Column({
        default: UserStatus.Active,
    })
    status!: UserStatus;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles!: Role[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
