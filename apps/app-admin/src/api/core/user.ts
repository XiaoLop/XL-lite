import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/**
 * 更新个人基本信息
 */
export async function updateProfileApi(data: {
  realName?: string;
  email?: string;
  desc?: string;
}) {
  return requestClient.put<UserInfo>('/user/profile', data);
}

/**
 * 修改密码
 */
export async function changePasswordApi(data: {
  oldPassword: string;
  newPassword: string;
}) {
  return requestClient.put('/user/password', data);
}

/**
 * 更新头像
 */
export async function updateAvatarApi(avatar: string) {
  return requestClient.put<UserInfo>('/user/avatar', { avatar });
}

/**
 * 上传头像文件
 */
export async function uploadAvatarFileApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post<{ url: string }>('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

