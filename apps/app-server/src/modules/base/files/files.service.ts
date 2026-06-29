import { Injectable, BadRequestException } from '@nestjs/common';
import { relative, sep } from 'node:path';
import { getUploadPath } from 'common/utils/upload';
import { FileUploadResultDto } from './dto/file-upload-result.dto';

@Injectable()
export class FilesService {
    uploadFile(file: Express.Multer.File): FileUploadResultDto {
        // 校验文件是否存在（客户端未上传文件时 file 为 undefined）
        if (!file) {
            throw new BadRequestException('请上传文件');
        }

        console.log(file);

        // 构造可访问的 URL（相对 ServeStatic 的 rootPath，用 / 拼接）
        const relativePath = relative(getUploadPath(), file.path)
            .split(sep)
            .join('/');
        const url = `/${relativePath}`;

        // 返回精简的响应数据
        return {
            url,
            originalname: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
}
