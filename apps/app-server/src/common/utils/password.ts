import * as bcrypt from 'bcrypt';

/**
 * 加密密码
 * @param password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const str = `${process.env.HASH_KEY || 'xl-management'}- ${password}`;
    return await bcrypt.hash(str, saltRounds);
}

/**
 * 比较密码
 * @param password
 * @param hashedPassword
 */
export async function comparePassword(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    const str = `${process.env.HASH_KEY || 'xl-management'}- ${password}`;
    return await bcrypt.compare(str, hashedPassword);
}
