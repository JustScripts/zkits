

import checkType from "./type.js";


/*** 检视 对象成员 
* @params  objVal  obj,待检测的对象
* @return  obj,对象的成员属性等信息 
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
export function viewObject(objVal){
  let type = checkType(objVal);
  if (type==='undefined' || type==='null' || type==='NaN') {
    throw new Error('zkits: error argument')
  }
  
  return {
    type: checkType(objVal),
    construct: objVal.constructor.name,
    members: getObjKeys(objVal),
  };
};


/*** 检视 类/构造函数的方法&属性等 
* @params  clsVal  Cls,待检测的构造函数 
* @return  obj,构造函数相关的属性/方法  
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
export function viewConstructor(clsVal){
  let type = checkType(clsVal);
  if (type!=='Function') { throw new Error('zkits:error argument: need a constructor'); }
  
  let members = [];
  try { members = getObjKeys( new clsVal() ) } 
  catch (e) { members = [{key: 'todo', rst: '获取报错', }]; } 
  
  let proto = clsVal.prototype.__proto__;
  return {
    type,
    extend: proto ? proto.constructor.name : proto,
    statics: getObjKeys( clsVal ),
    protos: getObjKeys( clsVal.prototype ),
    members,
  };
};



/* 工具函数: 获取对象的键值 */
function getObjKeys(checkObj){
  let typeMap = {
    'undefined': {
      key(arg){ return arg; },
      rst(arg){ return 'undefined'},
    },
    'null': {
      key(arg){ return arg; },
      rst(arg){ return 'null'},
    },
    'NaN': {
      key(arg){ return arg; },
      rst(arg){ return 'NaN'},
    },
    'Boolean': {
      key(arg){ return arg; },
      rst(arg){ return 'bol'},
    },
    'Number': {
      key(arg){ return arg; },
      rst(arg){ return 'num'},
    },
    'String': {
      key(arg){ return arg; },
      rst(arg){ return `'${arg}'`;},
    },
    'Function': {
      key(arg){ return arg; },
      rst(arg){ return 'fn'},
    },
    'Array': {
      key(arg){ return arg; },
      rst(arg){ return 'arr'},
    },
    'Date': {
      key(arg){ return arg; },
      rst(arg){ return 'date'},
    },
    'Regexp': {
      key(arg){ return arg; },
      rst(arg){ return 'rgep'},
    },
    'default': {
      key(arg){ return arg; },
      rst(arg){ return (arg+'').replace(/\[object\s(\w+)?\]/,'$1'); },
    },
  }
  
  let _members = []
  let keys = Object.getOwnPropertyNames(checkObj) 
  let _resultArr = keys.map(function(itm,idx ){
    let val = '' 
    try { val = checkObj[itm] } 
    catch(e){ val = '___' } 
    
    
    let current = typeMap[checkType(val)] || typeMap.default;
    itm = current.key(itm);
    val = current.rst(val);
    
    try { _members.push( { key: itm, rst: val, } ) } 
    catch (e) { _members.push({ key: '-', rst: '-', }) } 
  }) 
  return _members.sort((i1,i2)=>{
    return i1.key.charCodeAt(0)-i2.key.charCodeAt(0)
  });
};





/* ===================================================================== 测试 */
export function test(){
  console.log( viewObject({}) );
  console.log( viewConstructor(Object) );
  if (globalThis.document) {
    
  }
  else {
    console.log( viewConstructor( globalThis.Atomics ) );
  }
} 





