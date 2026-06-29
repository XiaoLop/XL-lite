import { join, isAbsolute } from 'path';
import fs from 'fs';

export function getUploadPath() {
    const uploadPath = isAbsolute(process.env.UPLOAD_PATH)
        ? join(process.env.UPLOAD_PATH)
        : join(process.cwd(), process.env.UPLOAD_PATH);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
}
