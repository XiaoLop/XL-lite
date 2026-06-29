import { diskStorage } from 'multer';
import { extname, join } from 'path';
import fs from 'fs';
import { randomUUID } from 'node:crypto';
import { HttpException, HttpStatus } from '@nestjs/common';
import type { MulterModuleOptions } from '@nestjs/platform-express';
import { getUploadPath } from 'common/utils/upload';

// 允许的文件类型
const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const allowedDocTypes = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'md',
];
const allowedVideoTypes = ['mp4', 'avi', 'wmv', 'mov'];
const allowedAudioTypes = ['mp3', 'wav', 'ogg'];

export const multerOptions: MulterModuleOptions = {
    // 限制文件大小 10MB
    limits: {
        fileSize: 1024 * 1024 * 10,
    },

    // 存储配置
    storage: diskStorage({
        destination: (req, file, cb) => {
            const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
            let folder = 'others';

            if (allowedImageTypes.includes(ext)) folder = 'images';
            else if (allowedDocTypes.includes(ext)) folder = 'documents';
            else if (allowedVideoTypes.includes(ext)) folder = 'videos';
            else if (allowedAudioTypes.includes(ext)) folder = 'audios';

            const uploadPath = join(getUploadPath(), folder);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),

    // 文件过滤
    fileFilter: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
        const allAllowed = [
            ...allowedImageTypes,
            ...allowedDocTypes,
            ...allowedVideoTypes,
            ...allowedAudioTypes,
        ];

        if (!allAllowed.includes(ext)) {
            return cb(
                new HttpException(
                    `不支持的上传文件类型: .${ext}`,
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
        cb(null, true);
    },
};
