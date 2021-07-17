// 

import './call.js'; // 依赖项  

Function.prototype.bind = function(context,...args){
  let that = this;
  return function(...args1){
    return that.call(context,...args,...args1); 
  };
}


/* ===================================================================== 测试 */
export function test(){
  let obj = { key : 111, }
  let fn = function( arg ){
    console.log(this.key, arg);
  }
  let fn1 = fn.bind(obj, 222);
  
  fn1() // 111 222 
} 




