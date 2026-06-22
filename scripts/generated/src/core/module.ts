import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import ejs from 'ejs';

import config from '../config';
import type { TemplateEntityOptions, TemplateGlobalArgs } from '../types/templates';
import { toCamelCase, clearDirectory, getFilesByExtension } from '../utils/tools';

function initNestModule(modelName: string) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            'npx',
            ['nest', 'g', 'resource', `modules/${modelName}`, '--no-spec'],
            {
                cwd: config.serverPath,
                shell: true,
                stdio: ['pipe', 'pipe', 'pipe'],
            }
        );

        // 逐个问题发送，并等待 inquirer 渲染完成
        let step = 0;
        child.stdout.on('data', (data: Buffer) => {
            const text = data.toString();
            if (step === 0 && text.includes('transport layer')) {
                child.stdin.write('\n');
                step++;
            } else if (step === 1 && text.includes('CRUD entry points')) {
                child.stdin.write('\n');
                child.stdin.end();
                step++;
            }
        });

        child.on('close', (code) => {
            code === 0 ? resolve(null) : reject(new Error(`exit: ${code}`));
        });
    });
}

function lintFixCode(modelName: string){
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
function getTemplateGlobalArgs(modelName: string, options: TemplateEntityOptions): TemplateGlobalArgs {
    return {
        globalName: modelName,
        moduleName: toCamelCase(`${modelName} Module`, true),
        serviceName: toCamelCase(`${modelName} Service`, true),
        serviceExampleName: toCamelCase(`${modelName} Service`),
        controllerName: toCamelCase(`${modelName} Controller`, true),
        entityName: toCamelCase(modelName, true),
        queryDtoName: toCamelCase(`${modelName} QueryDto`),
        createDtoName: toCamelCase(`Create ${modelName} Dto`),
        updateDtoName: toCamelCase(`Update ${modelName} Dto`),
        paginationDtoName: toCamelCase(`${modelName} PaginationDto`),
        responseDtoName: toCamelCase(`${modelName} ResponseDto`),
        isNoId: options.isNoId,
        isNoTime: options.isNoTime,
        fields: options.fields
    }
}


function writeTemplate(templatePath: string, wirtePath: string, templateArgs: TemplateGlobalArgs) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const code = ejs.render(template, templateArgs);

    // 判断文件夹是否存在
    if (!fs.existsSync(path.dirname(wirtePath))) {
        fs.mkdirSync(path.dirname(wirtePath), { recursive: true });
    }

    fs.writeFileSync(wirtePath, code); 
}

// 写入所有模板
function writeAllTemplate(wirtePath: string, templateArgs: TemplateGlobalArgs) {
    // 判断文件夹是否存在
    if (!fs.existsSync(wirtePath)) {
        fs.mkdirSync(wirtePath, { recursive: true });
    }

    // 清空文件夹中的内容
    clearDirectory(wirtePath);

    // 获取所有模板
    const templates = getFilesByExtension(config.templatePath, 'ejs');

    templates.forEach((template) => {

        const templateFileName = path.basename(template)
        const templateDir = path.join(path.dirname(template))
        
        // 剔除掉 template.ejs 后缀
        let writeFileName = templateFileName.replace('template.ejs', 'ts')
        if(!writeFileName.includes('.dto')){
            writeFileName = `${templateArgs.globalName}.${writeFileName}`
        }

        // 计算路径
        const writeFilePath = path.join(wirtePath, templateDir.replace(config.templatePath, ''), writeFileName)

        writeTemplate(
            template,
            writeFilePath,
            templateArgs
        );
    });

}

export default async function generatedModule(modelName: string, options: TemplateEntityOptions) {
    await initNestModule(modelName);
    writeAllTemplate(
        path.join(config.serverPath,'src', 
            `modules/${modelName}`), 
            getTemplateGlobalArgs(modelName, options)
        );
    await lintFixCode(modelName)
    console.log(`${modelName} 模块生成成功`);
}