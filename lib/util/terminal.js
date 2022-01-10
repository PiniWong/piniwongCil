//子线程工具
const { spawn }  = require('child_process');

//npm i 
//展示安装时的数据流
const commandSpawn = (...args) => {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(...args);
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
      childProcess.on("close", () => {
        resolve();
      })
    })
  }
  
  // const commandExec = (...args) => {
  //   return new Promise((resolve, reject) => {
  //     const childProcess = spawn(...args);
  //     childProcess.stdout.pipe(process.stdout);
  //     childProcess.stderr.pipe(process.stderr);
  //     childProcess.on("close", () => {
  //       resolve();
  //     })
  //   })
  // }
  
  module.exports = {
    commandSpawn
  }