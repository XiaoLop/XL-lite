import type { LoginRequestData, LoginResponseData, CaptchaResponseData } from '@/types/auth.type'
import { request } from '@/utils/request'

/**
 * 获取验证码接口
 * @returns
 */
export const getCaptchaApi = () => {
  return request.get<undefined, CaptchaResponseData>('/captcha')
}

/**
 * 登录接口
 * @param data
 * @returns
 */
export const loginApi = (data: LoginRequestData) => {
  return request.post<LoginRequestData, LoginResponseData>('/auth/login', data)
}

/**
 * 刷新短效token
 */
export const refreshAccessTokenApi = () => {
  return request.get<undefined, LoginResponseData>('/auth/refresh')
}
