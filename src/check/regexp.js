/*** 常用正则校验 
* @author  fsl 
* @time    时间值 
* -----------------------------
* @import   引入方式说明 
* @example  使用方式说明 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/

/*** 是否为邮箱地址 
* @params  email  str,待检测的email 
* @return  bol,是否为正确邮箱地址的布尔值 
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
export function isEmail(email){ 
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

/*** 数字验证 
* @params  num  str/num,待检测的数字 
* @return  bol,检测结果的布尔值 
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
export function isNumber(num){  
  num *= 1;
  return !isNaN(parseFloat(num)) && isFinite(num) && Number(num)===num;
}



/* ================================== 测试 ================================== */
export function test(){
  console.log( isEmail('mymail@gmail.com') ); //  true
  console.log( isNumber(0x10) ); //  true 
  console.log( isNumber('0x10') ); //  true 
} 



