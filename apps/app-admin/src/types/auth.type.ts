// 登录请求数据
export interface LoginRequestData {
  username: string
  password: string
  captchaId: string
  captcha: string
}

// 登录响应数据
export interface LoginResponseData {
  accessToken: string
}

// 验证码响应数据
export interface CaptchaResponseData {
  captchaId: string
  captchaImage: string
}
