/*** 防抖函数: 操作后的一段时间内只执行一次,触发操作将重新计算时间 
* @params  targetFn  fn,需防抖的目标函数 
* @params  time      num,间隔时间,unit:ms 
* @return  fn,改造后的防抖函数 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export default function main(targetFn,time=500){
  let timeoutId = null; 
  return function(){
    clearTimeout(timeoutId); 
    timeoutId = setTimeout(()=>{
      targetFn.apply(this, arguments);
    },time);
  };
}
/* 实现方式2 todo */
function fn2(targetFn,time){ } 


/* ===================================================================== 测试 */
export function test(){
  console.log(' test run ');
  let debounceFn = main(function(evt){
    console.log('#debounce', evt);
  })
  if (globalThis.document) {
    document.addEventListener("mousemove",function(evt){
      debounceFn(evt)
    })
  }
  else {
    let id = setInterval(()=>{
      console.log('11');
      debounceFn('evt')
    },100)
    
    setTimeout(()=>{
      clearInterval(id)
    },1000)
  }
} 


