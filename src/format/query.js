/*** 查询参数对象化 
* @params  search  str,查询参数字符,
*   如: ?key1=11&key2=22 或者 key1=11&key2=22 
* @params  link    str,连接符号,默认:'&',
* @params  split   str,分割符号,默认:'=',
* @return  obj,{ key1: [val,..], key2: val, },键值对 
* -----------------------------
* @author  fsl 
* @time    2020年5月13日 21:58:52 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export default function main(search,link="&",split='='){
  let result = {};
  let str = search;
  if (/^\?/.test(search)) { str = search.slice(1); }
  let arr = str.split(link);
  arr.forEach((itm,idx)=>{
    let arr1 = itm.split(split)
    let key = arr1[0]
    let val = arr1.slice(1).join(split); 
    if ( result[key] ) { result[key].push( val ) }
    else { result[key] = [ arr1.slice(1).join(split) ]; }
  })
  return result;
}

/*** 序列化对象为字符串 
* @params  targetObj  obj,待序列化的对象 
* @params  link       str,连接符号,默认:'&', 
* @params  split      str,分割符号,默认:'=', 
* @return  str,序列化后的字符串,不包含'?' 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @TODO  
* 1 当对象为多维时 
*/
export function querystring(targetObj, link='&', split='='){  
  var resultStr = ''
  for(var key in targetObj){
    let val = targetObj[key]; 
    resultStr +=  `${key}${split}${val}${link}` 
  };
  return resultStr.slice(0,-1);
}



/* ===================================================================== 测试 */
export function test(){
  console.log( main('key1=a&key2=b') );
  console.log( main('?key1=a&key2=b') );
  
  console.log( main('?key1=a&key1=b&key2=c') );
  console.log( main('?key1=a&key2=b=c') );
  
  console.log( main('?key1:a+key2:b:c','+',':') );
  
} 



