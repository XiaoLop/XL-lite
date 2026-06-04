// 视频平台
export enum VideoPlatformType {
  MixDrop = 'MixDrop',
  BoodStream = 'BoodStream',
  BigShare = 'BigShare',
  KrakenFiles = 'krakenfiles',
  Ove = 'ove',
  StreamTape = 'streamTape',
  Vidara = 'vidara',
  Vinovo = 'vinovo',
  Voe = 'voe',
  Vidmoly = 'vidmoly',
  Unknown = 'Unknown',
}

// 视频状态枚举
export enum VideoStatus {
  Processing = 'Processing',
  Success = 'Success',
  Failed = 'Failed',
}

// 视频信息
export interface VideoInfo {
  id: number
  title: string
  platform: VideoPlatformType
  link: string
  thumbnailUrl: string
  status: VideoStatus
  error_message?: string
  createdAt: string
  updatedAt: string
}

// 查询视频列表响应
export interface QueryVideoLinksResponse {
  list: VideoInfo[]
  total: number
}

// 查询视频列表参数
export interface QueryVideoLinksParams {
  pageNum: number
  pageSize: number
  platform?: VideoPlatformType | string
  status?: VideoStatus | string
  title?: string
  link?: string
  [key: string]: string | number | boolean | undefined
}

// 上传视频链接请求
export interface UploadVideoLinksDto {
  videoList: string[]
}

// 上传视频链接响应
export interface UploadVideoLinksResponse {
  success: string[]
  failed: string[]
}

// 更新视频链接请求
export interface UpdateVideoLinkDto {
  link: string
  title: string
  platform: string
  thumbnailUrl: string
  status: string
  error_message: string
}

// 删除视频链接请求
export interface DeleteVideoLinksDto {
  ids: number[]
}

// 删除视频链接响应
export interface DeleteVideoLinksResponse {
  code: number
  message: string
  data: null
}
