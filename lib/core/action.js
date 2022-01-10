
//引入子promisify工具 //实质是一个promise
const { promisify } = require('util')
//引入下载的库
const download = promisify(require('download-git-repo'));
//引入子进程的工具 打开浏览器
const { exec } = require('child_process')
const fs = require('fs');
const path = require('path');



//模块工具-------------------
const { vueRepo } = require('../config/repo-config')
const { commandSpawn } = require('../util/terminal');
const { compile, writeToFile, createDirSync,insertDataSync } = require('../util/utils');


const createprojectAction = async (project)=>{
    // console.log('why help you create your project~')
    log.hint('piniwong helps you create your project, please wait a moment~')

    //1、clone项目
    //使用git clone的方式
    await download(vueRepo,project,{clone:true})

    //2、执行npm install
        // 线程平台
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    console.log(command)
    await commandSpawn(command , ['install'] , { cwd:`./${project}`})

    //3.运行npm run serve
    commandSpawn(command,['run','serve'],{cwd:`./${project}`});

    //4.打开浏览器
    const open = process.platform === 'win32' ? 'start' : 'open';

    exec(`${open}"http://localhost:8080/"`)
}

const addComponentAction = async (name,dest)=>{
    //1编译ejs模板
    const result = await compile('vue-component.ejs',{name, lowerName: name.toLowerCase()})

    //2写入文件的操作
    const targetPath = path.resolve(dest,`${name}.vue`)
    writeToFile(targetPath,result)
}

const addPageAction = async (name,dest)=>{
    //1.编译模板
    const data = {name,lowerName:name.toLowerCase()}
    const pageResult = await compile('vue-component.ejs', data);
    const routeResult = await compile('vue-router.ejs',data);

    //写入文件
    const targetDest = path.resolve(dest, name.toLowerCase());
    if(createDirSync(targetDest)){
        const targetPagePath = path.resolve(targetDest,`${name}.vue`);
        const targetRouterPath = path.resolve(targetDest,`router.js`);
        writeToFile(targetPagePath,pageResult)
        writeToFile(targetRouterPath,routeResult)
    }

}
const addBaseRAction = async(name,title,dest)=>{
    //1.编译模板
    const data = {name,lowerName:name.toLowerCase(),title}
    const viewIResult = await compile('vue-router-view-i.ejs',data)
    const viewOResult = await compile('vue-router-view-o.ejs',data)
    const viewBaseResult = await compile('vue-router-view-base.ejs',data)
    const viewCompResult = await compile('vue-component.ejs',data)

    //router/view.js路径
    const targetDest = path.resolve('./',dest)
    if(fs.existsSync(targetDest)){
        // //插入import
        await insertDataSync('import',targetDest,viewIResult,name)
        //插入{router}
        await insertDataSync('object',targetDest,viewOResult,name)
    }else{ 
        writeToFile(targetDest,viewBaseResult)
    }

    //view下的vue
    const vuetargetDest = path.resolve('./',`src/views/${name}`)
    if(!fs.existsSync(vuetargetDest)){
        if(createDirSync(vuetargetDest)){
            const viewCompPath = path.resolve(vuetargetDest,`${name}.vue`)
          writeToFile(viewCompPath,viewCompResult)
        }
    }

    

}
const  addPageChildRAction = async(name,title,routername,dest)=>{
    //1.编译模板
    const data = {name,lowerName:name.toLowerCase(),title}
    const viewIResult = await compile('vue-router-view-chil-i.ejs',data)
    const viewOResult = await compile('vue-router-view-chil-o.ejs',data)
    const viewBaseResult = await compile('vue-router-view-base.ejs',data)
    const viewCompResult = await compile('vue-component.ejs',data)

    const targetDest = path.resolve('./',dest)
    if(fs.existsSync(targetDest)){
        await insertDataSync('import',targetDest,viewIResult,name)
        await insertDataSync('chil',targetDest,viewOResult,routername)
    }
    else{ 
        writeToFile(targetDest,viewBaseResult)
    }
    //view下的vue
    const vuetargetDest = path.resolve('./',`src/views/${name}`)
    if(!fs.existsSync(vuetargetDest)){
        if(createDirSync(vuetargetDest)){
            const viewCompPath = path.resolve(vuetargetDest,`${name}.vue`)
          writeToFile(viewCompPath,viewCompResult)
        }
    }
}
module.exports={
    createprojectAction,
    addComponentAction,
    addPageAction,
    addBaseRAction,
    addPageChildRAction
    
}