export interface RequestOptions extends RequestInit {
  timeout?: number // 添加超时配置
}

export interface HttpResponse<T> {
  code: number
  message: string
  data: T
}
