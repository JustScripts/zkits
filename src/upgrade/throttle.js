/*** 节流函数: 限制函数执行频率  
* @params  targetFn  fn,将被节流的函数 
* @params  time      num,执行的间隔时间,unit:ms 
* @params  immediate bol,是否立即执行,默认:true 立即执行
* @return  fn,被改造后的节流的函数 
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
export default function main(targetFn,time=500,immediate=true){  
  if (immediate) { return immediateFn(targetFn,time) }
  
  return delayFn(targetFn,time);
}
function immediateFn(targetFn,time){  
  let isRun = true; // 控制执行 
  return function(){
    if (!isRun) { return null; }
    
    isRun = false; 
    setTimeout(()=>{ isRun = true; },time);
    return targetFn.apply(this,arguments);
  };
}
function delayFn(targetFn,time){  
  let isRun = true; // 控制执行 
  let result = null; 
  return function(){
    if (!isRun){ return null; }  
    
    isRun = false; 
    setTimeout(()=>{ 
      isRun = true;
      result = targetFn.apply(this,arguments);
    },time);
    return result;
  };
}



/* ===================================================================== 测试 */
export function test(){
  let throttleFn1 = main(function(evt){ console.log('11111111111111111111111111111111111',evt); },500,true)
  let throttleFn2 = main(function(evt){ console.log('22222222222222222222222222222222222',evt); },500,false)
  if (globalThis.document) {
    document.addEventListener("mousemove",function(evt){
      console.log('000000000000000000000000000000000');
      throttleFn1(evt)
      throttleFn2(evt)
    })
  }
  else {
    let id = setInterval(()=>{
      console.log('000000000000000000000000000000000');
      throttleFn1('1')
      throttleFn2('2')
    },100)
    
    setTimeout(()=>{ clearInterval(id) },1000)
  }
} 

