/*** Object 扩展 
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

/* 注意事项: 直接定义原型 for-in时,将会遍历
* Object.prototype.forEach = function(callback){
*   for(var key in this){
*     callback(this[key],key);
*   };
* }
* // obj.forEach((val,key)=>{ })
* Object.prototype.map = function(callback){
*   let newObj = {};
*   this.forEach((val,key)=>{
*     newObj[key] = callback(val,key);
*   })
*   return newObj
* }
* // obj.map((key,val)=>{ return 1; })
* Object.prototype.filter = function(callback){
*   let newObj = {};
*   this.forEach((val,key)=>{
*     callback(val,key) && (newObj[key] = val);
*   })
*   return newObj
* }
* // obj.map((key,val)=>{ return 1; })
*/

Object.defineProperty(Object.prototype,'forEach',{
  value(callback){
    for(var key in this){
      callback(this[key],key);
    };
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
Object.defineProperty(Object.prototype,'map',{
  value(callback){
    let newObj = {};
    this.forEach((val,key)=>{
      newObj[key] = callback(val,key);
    })
    return newObj;
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
Object.defineProperty(Object.prototype,'filter',{
  value(callback){
    let newObj = {};
    this.forEach((val,key)=>{
      callback(val,key) && (newObj[key] = val);
    })
    return newObj;
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
Object.defineProperty(Object.prototype,'reduce',{
  value(callback,initVal){
    // 由于对象是无序的,无法类似数组从第二项开始 
    if (initVal===undefined) { return console.error('请指定初始值'); }
    
    let finalVal = initVal;
    this.forEach((val,key)=>{
      finalVal = callback(finalVal,val,key)
    })
    
    return finalVal;
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
Object.defineProperty(Object.prototype,'some',{
  value(callback){
    for(var key in this){
      if (callback(this[key],key)) { return true; }
    };
    
    return false;
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
Object.defineProperty(Object.prototype,'every',{
  value(callback){
    for(var key in this){
      if (!callback(this[key],key)) { return false; }
    };
    
    return true;
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})
/* 返回布尔值,判断对象的包含关系  */
Object.defineProperty(Object.prototype,'includes',{
  value(targetObj){
    // 任何对象都包含空对象  
    
    return !targetObj.some((val,key)=>{
      return this[key]!==val;
    });
  },         
  enumerable: false,  
  writable: true,     
  configurable: true, 
})



/* ===================================================================== 测试 */
export function test(){
  
  let mainObj = { key1: 1, key2: 2, }
  console.log( mainObj.includes({ key1: 1, }) ); // true 
  console.log( mainObj.includes({ key1: 2, }) ); // false 
  console.log( mainObj.includes({ key2: 2, }) ); // true 
  console.log( mainObj.includes({ key2: 1, }) ); // false 
  console.log( mainObj.includes({ key1: 1, key2: 2, }) ); // true 
  console.log( mainObj.includes({ key1: 2, key2: 2, }) ); // false 
  console.log( mainObj.includes({ key1: 1, key2: 3, }) ); // false 
  console.log( mainObj.includes({ key1: 1, key2: 2, key3: 1,  }) ); // false 
  console.log( mainObj.includes({ key1: 2, key2: 2, key3: 1,  }) ); // false 
  
} 


