import type { Field } from "./entity";

export type TemplateGlobalArgs = {
    globalName: string; // 全局名称
    moduleName: string;
    serviceName: string;
    // 服务实例名称 testService
    serviceExampleName: string;
    controllerName: string;
    entityName: string;

    queryDtoName: string;
    createDtoName: string;
    updateDtoName: string;
    paginationDtoName: string;
    responseDtoName: string;

    fields: Field[];
}


// 模板所需的参数
export interface TemplateModuleOptions {
    globalName: string; // 全局名称
    moduleName: string;
    serviceName: string;
    controllerName: string;
    entityName: string;
}

export interface TemplateControllerOptions {
    globalName: string; // 全局名称

    // 服务名称 TestService
    serviceName: string;
    // 服务实例名称 testService
    serviceExampleName: string;

    controllerName: string;

    createDtoName: string;
    updateDtoName: string;
    paginationDtoName: string;
    responseDtoName: string;
}

export interface TemplateServiceOptions {
    globalName: string; // 全局名称

    // 服务名称 TestService
    serviceName: string;

    entityName: string;

    createDtoName: string;
    updateDtoName: string;
    paginationDtoName: string;
}

export interface TemplateDtoOptions {
    globalName: string;
    createDtoName: string;
    queryDtoName: string;
    paginationDtoName: string;
    responseDtoName: string;
    updateDtoName: string;
}


export interface TemplateEntityOptions {
    fields: Field[];
}