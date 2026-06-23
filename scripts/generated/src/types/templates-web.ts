import type { Field } from "./entity";

export interface FieIds extends Partial<Field> {
} [];


// 模板所需的参数
export interface TemplateGlobalOptions {
    name: string; // 名称
    fields: Field[]; // 字段

    // 类型名称
    namespace: string;
    itemName: string;
    responseName: string;
    createParamsName: string;
    updateParamsName: string;
    quryParamsName: string;

    // 接口名称
    getListApiName: string;
    getDetailApiName: string;
    createApiName: string;
    updateApiName: string;
    deleteApiName: string;

    useHookName: string;

}