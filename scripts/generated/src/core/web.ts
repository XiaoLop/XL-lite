import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import ejs from 'ejs';

import config from '../config';
import { toCamelCase } from '../utils/tools';
import type { TemplateGlobalOptions } from '../types/templates-web';
import type { Field } from "../types/entity";

function lintFixCode(modelName: string) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            'npx',
            ['eslint', `src/modules/${modelName}/**/*.ts`, '--fix'],
            {
                cwd: config.serverPath,
                shell: true,
                stdio: 'inherit',
            }
        );

        child.on('close', (code) => {
            code === 0 ? resolve(null) : reject(new Error(`exit: ${code}`));
        })
    })
}

// 生成模板参数
function getTemplateGlobalArgs(webName: string, fields: Field[]): TemplateGlobalOptions {
    return {
        name: webName, // 名称
        fields: fields, // 字段

        // 类型名称
        namespace: toCamelCase(`${webName} Api`, true),
        itemName: toCamelCase(`${webName} Item`, true),
        responseName: toCamelCase(`${webName} List Response`, true),
        createParamsName: toCamelCase(`Create ${webName} Params`, true),
        updateParamsName: toCamelCase(`Update ${webName} Params`, true),
        quryParamsName: toCamelCase(`Query ${webName} Params`, true),

        // 接口名称
        getListApiName: toCamelCase(`get ${webName} List Api`),
        getDetailApiName: toCamelCase(`get ${webName} Detail Api`),
        createApiName: toCamelCase(`create ${webName} Api`),
        updateApiName: toCamelCase(`update ${webName} Api`),
        deleteApiName: toCamelCase(`delete ${webName} Api`),

        useHookName: toCamelCase(`use ${webName}`),
    }
}

/**
 * 生成模板
 * @param templatePath 模板路径
 * @param wirtePath 写入路径
 * @param templateArgs 模板参数
 */
function writeTemplate(templatePath: string, wirtePath: string, templateArgs: TemplateGlobalOptions) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const code = ejs.render(template, templateArgs);

    // 判断文件夹是否存在
    if (!fs.existsSync(path.dirname(wirtePath))) {
        fs.mkdirSync(path.dirname(wirtePath), { recursive: true });
    }

    fs.writeFileSync(wirtePath, code);
}

// 写入所有模板
function writeAllTemplate(wirtePath: string, templateArgs: TemplateGlobalOptions) {

    const writeTask: {
        templatePath: string,
        wirtePath: string,
    }[] = []

    // 写入API模块
    const templateApiPath = path.join(config.templateWebPath, 'api/core', 'api.template.ejs');
    const webApiPath = path.join(wirtePath, './api/core', `${templateArgs.name}.ts`);
    writeTask.push({ templatePath: templateApiPath, wirtePath: webApiPath })

    // 写入 composables
    const templateComposablePath = path.join(config.templateWebPath, 'composables', 'useHook.template.ejs');
    const webComposablePath = path.join(wirtePath, './composables', `${templateArgs.useHookName}.ts`);
    writeTask.push({ templatePath: templateComposablePath, wirtePath: webComposablePath })

    // 写入 view 组件
    const templateViewPath = path.join(config.templateWebPath, 'views/template', 'index.template.ejs');
    const webViewPath = path.join(wirtePath, './views', `./${templateArgs.name}/index.vue`);
    writeTask.push({ templatePath: templateViewPath, wirtePath: webViewPath })

    // 写入 formData 组件
    const templateFormDataPath = path.join(config.templateWebPath, 'views/template', 'formData.template.ejs');
    const webFormDataPath = path.join(wirtePath, './views', `./${templateArgs.name}/formData.vue`);
    writeTask.push({ templatePath: templateFormDataPath, wirtePath: webFormDataPath })

    writeTask.forEach((task) => {
        writeTemplate(
            task.templatePath,
            task.wirtePath,
            templateArgs
        );
    })

    // 在 core/index.ts 中导入
    const apiCoreIndexPath = path.join(wirtePath, './api/core/index.ts');
    const code = `export * from './${templateArgs.name}';\n`;

    // 判断是否已经导入了 该模块
    if (fs.existsSync(apiCoreIndexPath)) {
        const content = fs.readFileSync(apiCoreIndexPath, 'utf-8');
        if (content.includes(`export * from './${templateArgs.name}'`)) {
            return;
        }
    }

    fs.appendFileSync(apiCoreIndexPath, code); // 追加内容

}

export default async function generatedWeb(webName: string, fields: Field[]) {
    writeAllTemplate(
        path.join(config.webPath, 'src'),
        getTemplateGlobalArgs(webName, fields)
    );
    // await lintFixCode(modelName)
    console.log(`${webName} 模块生成成功`);
}