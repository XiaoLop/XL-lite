import path from 'path'

export default {
    rootPath: path.join(process.cwd(), '../../'), // 项目根目录
    serverPath: path.join(process.cwd(), '../../apps/app-server'), // 服务端目录
    webPath: path.join(process.cwd(), '../../apps/app-admin'), // 客户端目录
    templatePath: path.join(process.cwd(), './templates'),
    templateWebPath: path.join(process.cwd(), './templates-web'),
}