/*** 时间格式化 
* @params  time? str,可选,需格式化的时间,默认:当前时间 
* @return  str,格式化后的时间的字符串表示 
* -----------------------------
* @author  fsl 
* @time    2020年5月10日 11:23:00 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export default function main(time){
  let _time =  new Date();
  if (time) { _time = new Date(time); }
  
  let year = _time.getFullYear() 
  let month = _time.getMonth() + 1 
  let day = _time.getDate() 
  let hour = _time.getHours() 
  let min = _time.getMinutes() 
  let sec = _time.getSeconds() 
  let ms = _time.getMilliseconds() 
  return `${year}-${month}-${day} ${hour}:${min}:${sec}:${ms}`;
  // '2020-05-08 05:15:12:87'
}


/* ===================================================================== 测试 */
let fnMap = {
  main,
}
export function test(flg='main'){
  console.log( fnMap[flg]() );
  
  console.log( fnMap[flg]('2020') );
  
  console.log( fnMap[flg]('2020-10') );
  console.log( fnMap[flg]('2020.10') );
  
  console.log( fnMap[flg]('10-01') );
  console.log( fnMap[flg]('10.01') );
  
  console.log( fnMap[flg]('20') );
  
}



