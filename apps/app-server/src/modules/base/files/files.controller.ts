import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileUploadResultDto } from './dto/file-upload-result.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { ApiResult } from 'common/decorators/api-result.decorator';

@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('upload')
    @ApiOperation({ summary: '上传文件' }) // ③ 接口摘要
    @ApiConsumes('multipart/form-data') // ④ 声明 multipart 上传
    @ApiBody({
        // ⑤ 描述上传字段
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary', // 表示是文件类型
                    description: '上传的文件',
                },
            },
        },
    })
    @ApiResult({
        // ⑥ 响应结构
        type: FileUploadResultDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file);
    }
}
