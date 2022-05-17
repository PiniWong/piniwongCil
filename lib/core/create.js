const program = require('commander')

const { 
    createprojectAction ,
    addComponentAction,
    addPageAction,
    addBaseRAction,
    addPageChildRAction,
} = require('./action');

const createCommands = () =>{
    program
     .command('create <project> [others...]')
    //创建命令行
    //create 为标志必填 project 为必选参数 other 为可选参数
    //必选<> 可选[]
    .description('clone a repository into a folder')
    //描述
    .action(createprojectAction);
    //执行
    
    program
      .command('addcpn <name>')
      .description('add vue component, 例如: piniwong addcpn HelloWorld [-d src/components]')
      .action((name)=>{
        addComponentAction(name,  program.dest || 'src/components');
      })

    program
      .command('addpage <page> [dest...]')
      .description('add vue page and router config, 例如: piniwong addpage Home [-d src/pages]')
      .action((page,dest)=>{
        addPageAction(page, dest[0] || 'src/pages');
      })
    
    program
      .command(`addbase-R <name> [options...]`)
      .description('add vue base view router config,例如：piniwong addbase-R register [-d 1：chilename//创建的metatitle 2：src/router/view//路由文件(默认为src/router/routes.js)]')
      .action((name,options)=>{
          addBaseRAction(name,options[0],options[1] || 'src/router/routes.js');
      })

    program
      .command(`addchil-R <name> <faname> [options...]`)
      .description('add vue page child router config,例如：piniwong addchil-R register  fatherCompname  [-d 1：chilename//创建的meta title 2：src/router/view//路由文件]')
      .action((name,faname,options)=>{
        addPageChildRAction(name,options[0],faname,options[1] || 'src/router/routes.js');
      })

}
module.exports = createCommands