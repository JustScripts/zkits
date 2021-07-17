
/*** 取舍小数位 
* @params  num  num,待处理的数值 
* @return  float,处理完成的数值 
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
export function roundFloat(num,decimals=0){  
  return Number( Math.round(`${num}e${decimals}`) + `e-${decimals}` );
}





/* ===================================================================== 测试 */
export function test(){
  
  console.log( roundFloat(1.123456789, 6) );
  console.log(' ----------------------------------------------------  ');
  
} 


