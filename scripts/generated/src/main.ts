#!/usr/bin/env node
import { Command } from 'commander';
import generatedModule from './core/module';
import { analyFieds } from './utils/analyFieds';
import generatedAdmin from './core/web'

const program = new Command();

program
    .name('xl-cli')
    .description('快速开发框架，用于快速生成实体类，模块，界面')
    .version('0.0.1');

// 生成Nest模块
program
    .command('module <name>')
    .description('生成Nest模块')
    .option('-f, --fields <fields>',
        `字段列表 (格式：字段名:字段类型:是否必填:默认值:注释,字段名:字段类型:是否必填:默认值:注释)。 
         字段类型: string | number | boolean | Date 
         是否必填: true | false
        `)
    .action((name, options) => {

        const newOptopms = {
            fields: analyFieds(options.fields)
        }

        generatedModule(name, newOptopms)
    });

program
    .command('admin <name>')
    .description('生成后台界面')
    .option('-f, --fields <fields>',
        `字段列表 (格式：字段名:字段类型:是否必填:默认值:注释,字段名:字段类型:是否必填:默认值:注释)。 
         字段类型: string | number | boolean | Date 
         是否必填: true | false
        `)
    .action((name, options) => {

        generatedAdmin(name, analyFieds(options.fields))
    });

program.parse();