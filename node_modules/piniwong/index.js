#!/usr/bin/env node

const program = require('commander');
//用于快捷开发命令行工具，提高开发效率的工具包

const helpOptions  = require('./lib/core/help')
const createCommands  = require('./lib/core/create')

//查看版本号
program.version(require('./package.json').version);

//帮助和可选信息
helpOptions();

//创建并执行命令
createCommands();

program.parse(process.argv)
