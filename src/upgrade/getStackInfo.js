/*** 获取调用栈信息 [严格模式下可用] 
* @params  / 
* @return  obj, 
*   .method  所在函数/方法名 
*   .file    调用文件路径 
*   .line    调用行号 
*   .pos     调用行位置 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 error.stack  为非标准属性,根据JS引擎不同可能标准不同,
* -----------------------------
* @update  
*/
export default function main() {
  /* 有括号的类型 */
  // "at main (http://127.0.0.1:8080/functions/getStackInfo.js:23:17)"
  // 'at main (D:\\mystudio\\repos\\zkits\\base\\functions\\getStackInfo-_-.js:27:17)'
  let stackReg = /at\s+(.*?)\s+\((.*?):(\d*):(\d*)\)/;  
  /* 无括号类型 */
  // "at http://127.0.0.1:8080/functions/getStackInfo.js:53:31"
  // 'at D:\\mystudio\\repos\\zkits\\node\\require_esmodule_file.js:149:14'
  let stackReg2 = /at\s+()(.*?):(\d*):(\d*)/;
  
  let stackList = (new Error()).stack
  /* 无法匹配特殊字符时,如换行等 的替换方案,将字符可视化 */
  // stackList = encodeURI(stackList);
  // stackList.split('%0A%20%20%20%20');
  stackList = stackList.split('\n')
  stackList = stackList.slice(1);
  // 去掉 node 模块加载 相关的栈调用 
  // console.log( stackList );
  stackList = stackList.filter( itm=>{
    return !itm.includes("Module.") && !itm.includes("require ") && !itm.includes("internal/")
  })
  stackList = stackList.map( itm=>(itm.trim()) )
  
  stackList = stackList.map( itm=>(stackReg.exec(itm) || stackReg2.exec(itm)) )
  stackList = stackList.map( itm=>{
    if (itm && itm.length === 5) {
      return {
        method: itm[1], 
        file: itm[2], 
        line: itm[3], 
        pos: itm[4], 
      };
    }
    
    return null;
  })
  return stackList;
}

/* TODO: 过滤方法1: */
export function xx1(){ } 
/* TODO: 过滤方法2: */
export function xx2(){ } 

/* ===================================================================== 测试 */
export function test(){  
  'use strict';
  function fn1() {
    console.log( '#当前执行的 stack 1: ', main() );
  }    
  fn1();
  
  console.log( '#当前执行的 stack 2: ', main());
}
console.log( '#当前执行的stack 3: ', main() );


