import type { HttpResponse, RequestOptions } from '@/types/request.type'
import { showError } from '@/hooks/toast'
import { refreshAccessTokenApi } from '@/api/auth'
import { useRouter } from 'vue-router'

// 处理query参数
type QueryParams = Record<string, string | number | boolean | undefined>

function handleQuery<T extends QueryParams>(data: T): string {
  const params = data
    ? Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&')
    : ''
  return params ? `?${params}` : ''
}

async function parseError<T>(response: Response): Promise<T> {
  try {
    return await response.json()
  } catch {
    return {
      code: response.status,
      message: response.statusText,
      data: null,
    } as T
  }
}

class HttpClient {
  private baseUrl = import.meta.env.VITE_BASE_URL || '/api'
  private defaultTimeout = 5000 // 默认超时时间5秒

  // 请求拦截
  private async requestInterceptor(url: string, options: RequestOptions) {
    // 获取token
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      headers.append('Authorization', `Bearer ${accessToken}`)
    }

    Object.entries(options.headers || {}).forEach(([key, vlaue]) => headers.append(key, vlaue))

    return {
      url: `${this.baseUrl}${url}`,
      options: {
        ...options,
        headers,
      },
    }
  }

  // 刷新access_token
  private async refreshAccessToken() {
    const result = await refreshAccessTokenApi()
    localStorage.setItem('access_token', result.data.accessToken)
  }

  private async request<T>(url: string, options: RequestOptions): Promise<HttpResponse<T>> {
    const { url: newUrl, options: newOptions } = await this.requestInterceptor(url, options)
    const controller = new AbortController()
    const timeout = newOptions.timeout || this.defaultTimeout

    // 设置超时定时器
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeout)

    try {
      const response = await fetch(newUrl, {
        ...newOptions,
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = await parseError<HttpResponse<{ code: number } | null>>(response)
        const router = useRouter()

        // 处理错误
        switch (error.code) {
          case 502:
            showError(error.message, '网络错误')
            break
          case 401:
            switch (error.data?.code) {
              case 10001:
                await this.refreshAccessToken()
                return await this.request(url, options)
              case 20001:
                // 清除token
                localStorage.removeItem('access_token')
                // 跳转登录页
                router.replace('/login')
                break
            }
          default:
            break
        }

        throw error
      }

      const result: HttpResponse<T> = await response.json()

      return result
    } catch (error) {
      // 检查是否为超时错误
      if (error instanceof Error && error.name === 'AbortError') {
        showError(`Request timeout after ${timeout}ms`, '请求超时')
      }

      throw error
    } finally {
      // 清除定时器
      clearTimeout(timeoutId)
    }
  }

  get<REQ extends QueryParams | undefined, RES>(
    url: string,
    data?: REQ,
    options: RequestOptions = {},
  ): Promise<HttpResponse<RES>> {
    const queryString = handleQuery(data || {})
    const newUrl = `${url}${queryString}`

    return this.request(newUrl, { ...options, method: 'GET' })
  }
  post<REQ, RES>(url: string, data: REQ, options: RequestOptions = {}): Promise<HttpResponse<RES>> {
    return this.request(url, { ...options, method: 'POST', body: JSON.stringify(data) })
  }

  patch<REQ, RES>(
    url: string,
    data: REQ,
    options: RequestOptions = {},
  ): Promise<HttpResponse<RES>> {
    return this.request(url, { ...options, method: 'PATCH', body: JSON.stringify(data) })
  }

  delete<REQ, RES>(
    url: string,
    data?: REQ,
    options: RequestOptions = {},
  ): Promise<HttpResponse<RES>> {
    return this.request(url, { ...options, method: 'DELETE', body: JSON.stringify(data) })
  }
}

export const request = new HttpClient()
