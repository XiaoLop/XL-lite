import fs from 'fs';
import path from 'path';

/**
 * 清空指定目录中的所有文件和子目录（保留目录本身）
 *
 * @param dirPath - 目标目录路径
 * @returns 是否成功清空（目录不存在时返回 false）
 *
 * @example
 * clearDirectory('./dist') // 清空 dist 目录下的所有内容
 */
export function clearDirectory(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }

  return true;
}

/**
 * 将字符串转换为驼峰命名（camelCase / PascalCase）
 *
 * 支持的分隔符：连字符 `-`、下划线 `_`、空格、以及已有的大小写边界
 *
 * @param str - 输入字符串
 * @param firstCharUpperCase - 首字母是否大写；false 为 camelCase（小驼峰），true 为 PascalCase（大驼峰）
 * @returns 转换后的驼峰命名字符串
 *
 * @example
 * toCamelCase('hello-world')        // 'helloWorld'
 * toCamelCase('hello_world', true)  // 'HelloWorld'
 * toCamelCase('hello world')        // 'helloWorld'
 * toCamelCase('HelloWorld')         // 'helloWorld'
 * toCamelCase('HTTPRequest', true)  // 'HttpRequest'
 */
export function toCamelCase(str: string, firstCharUpperCase = false): string {
  // 1. 在大小写转换边界处拆分（如 helloWorld -> hello World）
  // 2. 处理连续大写后接小写的情况（如 HTTPRequest -> HTTP Request）
  const normalized = str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase();

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const camelWords = words.map((word, index) => {
    if (index === 0 && !firstCharUpperCase) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return camelWords.join('');
}

/**
 * 递归获取指定目录下指定后缀的文件路径
 *
 * @param dirPath - 目标目录路径
 * @param extension - 文件后缀（如 '.ejs' 或 'ejs'）
 * @returns 匹配的文件路径数组（包含 dirPath 的相对路径，使用正斜杠）
 *
 * @example
 * getFilesByExtension('./a', '.ejs')
 * // 返回 ['a/b.ejs', 'a/c.ejs', 'a/d/e.ejs', 'a/d/f/g.ejs']
 */
export function getFilesByExtension(dirPath: string, extension: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  // 统一后缀格式：确保以 . 开头
  const ext = extension.startsWith('.') ? extension : `.${extension}`;

  const result: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        // 统一使用正斜杠，避免 Windows 路径差异
        result.push(fullPath.replace(/\\/g, '/'));
      }
    }
  }

  traverse(dirPath);

  return result;
}
