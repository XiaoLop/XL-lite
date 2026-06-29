import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResultDto {
    @ApiProperty({
        description: '文件访问URL',
        example: '/images/a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
    })
    url!: string;

    @ApiProperty({
        description: '原始文件名',
        example: 'avatar.png',
    })
    originalname!: string;

    @ApiProperty({
        description: '存储文件名',
        example: 'a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png',
    })
    filename!: string;

    @ApiProperty({
        description: '文件大小(字节)',
        example: 204800,
    })
    size!: number;

    @ApiProperty({
        description: '文件MIME类型',
        example: 'image/png',
    })
    mimetype!: string;
}
