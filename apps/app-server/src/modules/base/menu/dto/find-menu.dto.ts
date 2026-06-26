import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';

export class FindMenuDto extends PartialType(CreateMenuDto) {
    @ApiProperty({
        description: '菜单id',
    })
    id!: number;
}
