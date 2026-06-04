import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'public';

// 公共接口
export const Public = () => SetMetadata(PUBLIC_KEY, true);
