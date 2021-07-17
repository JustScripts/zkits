/*** 一段时间内,若满足条件则执行,否则超时失败 
* @params  bolFn fn=>bol,返回一个布尔值的函数,用于判断条件是否满足 
* @params  total num,最长的超时时间,unit:ms 
* @params  step  num,查询的间隔时间,unit:ms 
* @return  Promise,满足条件执行resolve,超时失败reject 
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
export default function main(bolFn, total=1000*33, step=1000*0.333){
  if (typeof bolFn != 'function') { return Promise.reject('error arguments: bolFn error'); }
  
  // console.log('# query');
  let totalRest = total-step; 
  if ( bolFn(totalRest) ) { return Promise.resolve('success') }
  if ( totalRest<0 ) { return Promise.reject('timeout') }
  
  // 方式一: 
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve( main(bolFn, totalRest, step) )
    },step)
  })
  // 方式二: 
  // return new Promise((resolve,reject)=>{
  //   setTimeout(()=>{ resolve() }, step)
  // })
  // .then(()=>{
  //   return main(bolFn, totalRest, step) ;
  // })
}



/* ===================================================================== 测试 */
let map = {
  main(){
    let f = false; 
    setTimeout(()=>{ f = true },3000)
    
    main(()=>{ return f; })
    .then((msg)=>{
      console.log(msg);
    }
    ,err=>{
      console.warn(err);
    })
  }, 
}
export function test(flg='main'){
  return map[flg](); 
}


