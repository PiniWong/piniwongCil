const ejs = require('ejs')
const path = require('path')
const fs = require('fs');


//解析模板
const compile = (template,data)=>{
    //拼接绝对路径
    const templatePosition = `../templates/${template}`
    const templatePath = path.resolve(__dirname,templatePosition)

    return new Promise((resolve,reject)=>{
        //使用ejs的renderFile解析模板
        ejs.renderFile(templatePath,{data},{},(err,result)=>{
            if(err){
                console.log(err)
                reject(err);
                return;
            }
            resolve(result)
        })
    })
    
}

const writeToFile=(path,content)=>{
    //判断path是否存在，如果不存在，创建对应的文件
    return fs.promises.writeFile(path,content);
}


//创建目录 递归调用从最底层目录检查是否已经创建 若未创建则创建
const createDirSync = (pathName)=>{
    console.log(pathName)
    if(fs.existsSync(pathName)){
        return true;
    }else{
        if(createDirSync(path.dirname(pathName))){
            fs.mkdirSync(pathName);
            return true;
        }
    }
}

//文本插入数据
const insertDataSync = (type,dest,value,routername,)=>{
    let readData = fs.readFileSync(dest,'utf-8').split(/\r\n|\n|\r/gm)
    //g是全局匹配 m是多行匹配 i是不分大小写 U只匹配最近的一个字符串; 
    let targetLine = 0
    
    //正则
    let regexp =new RegExp('component:' + '\x20*' + `${routername}`)
    let chilregexp =new RegExp(/children/)
    let poinregexp =new RegExp(/},|}/)
    let importregexp =new RegExp('const ' + '\x20*' + `${routername}`)

    //断点
    let chilbreak=true,importbreak=true;

    //正则断点
    let flagRegexp = false
    let flagChil = false
    //chile之后的第一个},
    let flagPoin = false
    //import false找到时可通行
    let flagimport = false
    
            readData.forEach((el,index) => {
                //先寻找一个属于 'const ${routername}'的行
                importregexp.test(el) ? flagimport=true : ''
                if(type=='import'&&!flagimport&&importbreak){
                    //找到时退出
                    targetLine=0
                    importbreak=false
                    
                }
                //先寻找一个属于 'component:${routername}'的行
                regexp.test(el) ? flagRegexp=true : ''
                //先寻找一个属于 },}，
                poinregexp.test(el) ? flagPoin=true : ''
                if(flagRegexp){
                    //找到第一个条件行之后 再寻找 属于regexp之后的第一个chil
                    chilregexp.test(el) ? flagChil=true : ''

                }
                //如果有Poin值执行
                if(type=='object'&&flagPoin){
                    targetLine=index
                }
                //如果有chil值执行
                if(type=='chil'&&flagChil&&chilbreak){
                    targetLine=index+1
                    chilbreak=false
                }
                

            });

    //若检测到已存在则抛出错误
    if(type ==  'chil' && chilbreak){
            throw new Error(`The parent route '${routername}' does not exist --You can use the 'piniwong addbase-R <your router name> [title,dest]' to create`)
    }
    if(type ==  'import' && importbreak){

        throw new Error(`The  route '${routername}' address already exists`)
    }
    // console.log()
    
    readData.splice(targetLine,0,value)
    fs.writeFileSync(dest,readData.join('\r\n'))
}

module.exports = {
    compile,
    writeToFile,
    createDirSync,
    insertDataSync,
}

