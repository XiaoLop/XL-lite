import { ApiProperty } from '@nestjs/swagger';

// 公共响应类
export class CommonResponseDto<T> {
    @ApiProperty({ description: '业务状态码：0 表示成功', example: 0 })
    code: number;

    @ApiProperty({ description: '响应信息', example: 'OK' })
    message: string;

    @ApiProperty({ description: '响应数据' })
    data?: T;

    constructor(code: number, message: string, data: T) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}
