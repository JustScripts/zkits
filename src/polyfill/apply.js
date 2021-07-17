// 

import './call.js'; // 依赖项  

Function.prototype.apply = function(context,argList){
  return this.call(context,...argList);
}



/* ===================================================================== 测试 */
export function test(){
  
  Array.prototype.forEach.apply(['a','b','c'],[function(itm,idx){
    console.log(idx,itm);
  }])
  
} 





