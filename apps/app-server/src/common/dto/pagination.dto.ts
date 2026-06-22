import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        description: '页码',
        required: true, // 是否必填
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNum?: number = 1;

    @ApiProperty({
        description: '每页数量',
        required: true, // 是否必填
    })
    @IsOptional() // 是否可选
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number = 10;
}
