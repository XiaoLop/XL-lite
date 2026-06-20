import { baseRequestClient, requestClient, type ApiResponse } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    username: string;
    password: string;
    captcha: string;
    captchaId: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  /** 验证码返回值 */
  export interface CaptchaResult {
    captchaId: string;
    captchaImage: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 获取验证码
 */
export async function getCaptchaApi() {
  const res = await baseRequestClient.get<ApiResponse<AuthApi.CaptchaResult>>('/captcha');
  return res.data.data;
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  const res = await baseRequestClient.post<ApiResponse<string>>('/auth/refresh', {
    withCredentials: true,
  });
  return res.data
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true, // 跨域请求时携带cookie
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
