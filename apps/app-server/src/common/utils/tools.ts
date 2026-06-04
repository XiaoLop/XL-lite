// 仅支持基础运算符 + - * /
export function safeEval(expr: string) {
    // 白名单校验：只允许数字和运算符
    if (!/^[\d\s+\-*/.()]+$/.test(expr)) {
        throw new Error('Invalid expression');
    }
    return eval(expr) as number;
}
