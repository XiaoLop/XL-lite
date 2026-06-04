import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({
        description: '权限名称',
    })
    name!: string;

    @ApiProperty({
        description: '权限编码',
    })
    code!: string;
}
