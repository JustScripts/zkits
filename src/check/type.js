
/*** 检测值类型  
* @params  checkVal  any,待检测类型的值 
* @return  KW,值的类型 
*   'undefined' 'null' 'NaN' 
*   'Boolean' 'Number' 'String' 'Function' 
*   'Array' 'Date' 'Regexp' ... 'Object' 
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
let typeOfMap = {
  boolean: 'Boolean',
  number: 'Number',
  string: 'String',
  function: 'Function',
  object: 'Object',
}
export default function main(checkVal){
  // 特殊值检测 
  if (checkVal===null) { return 'null'; }
  else if (checkVal===undefined) { return 'undefined' }
  else if (Number.isNaN(checkVal)) { return 'NaN'; }
  
  // typeof 检测 
  let typeOfVal = typeOfMap[ typeof checkVal ]
  if (typeOfVal!='Object') { return typeOfVal; }
  
  // 对象的具体类型检测 
  let objType = Object.prototype.toString.call(checkVal).slice(8,-1); 
  if (objType) { return objType }
  
  console.warn('注意: 未知类型')
  return '未知类型'
}


/*** 是否是对象  
* @params  checkVal  any,待检测的值 
* @return  bol,是否为对象类型的布尔值表示 
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
export function isObject(checkVal){
  if (checkVal===null) { return false; }
  
  let typeOfVal = typeof checkVal;
  if (typeOfVal==='function') { return true; }
  
  return typeOfVal==='object';
} 



/*** 是否为 NaN  
* @params  checkVal  any,待检测的值 
* @return  bol,是否为 NaN 的布尔值表示 
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
export function isNaN(val){ return Number.isNaN(val); } 





/* ==================================================================== 测试  */ 
let fnMap = {
  main,
  isObject,
  isNaN,
}
export function test(fnName='main'){
  console.log( fnMap[fnName]() );
  console.log( fnMap[fnName]( undefined ) );
  console.log( fnMap[fnName]( null ) );
  console.log( fnMap[fnName]( NaN ) );
  console.log( fnMap[fnName]( true ) );
  console.log( fnMap[fnName]( false ) );
  console.log( fnMap[fnName]( 0 ) );
  console.log( fnMap[fnName]( 1 ) );
  console.log( fnMap[fnName]( 11 ) );
  console.log( fnMap[fnName]( '' ) );
  console.log( fnMap[fnName]( '1' ) );
  console.log( fnMap[fnName]( 'a' ) );
  console.log( fnMap[fnName]( function(){ } ) );
  console.log( fnMap[fnName]( Object) );
  console.log( fnMap[fnName]( ()=>{} ) );
  console.log( fnMap[fnName]( [] ) );
  console.log( fnMap[fnName]( [1] ) );
  console.log( fnMap[fnName]( ['a'] ) );
  console.log( fnMap[fnName]( new Date() ) );
  console.log( fnMap[fnName]( /1/ ) );
  console.log( fnMap[fnName]( new RegExp() ) );
  console.log( fnMap[fnName]( globalThis ) );
  console.log( fnMap[fnName]( {} ) );
  console.log( fnMap[fnName]( {a:1,} ) );
  console.log( fnMap[fnName]( new Object() ) );
} 



