/*** 算术四则运算 精确计算  
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

// 工具方法: 获取数值的小数位个数 
function getDecimal(num){
  let arr = num.toString().split('.')
  let result = 0; 
  if (arr[1]) { result = arr[1].length; }
  return result; 
}
/*** 精确四则运算 方式1: 转换为整数后运算 缺点: 可能导致大整数溢出问题
* @params  xxx  type,参数说明
* @return  type,返回值说明 
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
export function preciseCalc1(type,num1,num2,decimal){
  /* 
  type     KW,运算类型: '+' '-' '*' '/' 
  num1     num,操作数1 
  num2     num,操作数2 
  decimal  int,保留小数位,默认:2 
  */
  let typMap = { 
    '+': function(n1,n2,pow1,pow2){ 
      let pow = Math.max(pow1,pow2)
      let p = Math.pow(10,pow)
      return (n1*p+n2*p)/p;
    }, 
    '-': function(n1,n2,pow1,pow2){ 
      let pow = Math.max(pow1,pow2)
      let p = Math.pow(10,pow)
      return (n1*p-n2*p)/p;
    }, 
    '*': function(n1,n2,pow1,pow2){ 
      let p1 = Math.pow(10,pow1)
      let p2 = Math.pow(10,pow2)
      return ((n1*p1)*(n2*p2))/p1/p2;
    }, 
    '/': function(n1,n2,pow1,pow2){ 
      let p1 = Math.pow(10,pow1)
      let p2 = Math.pow(10,pow2)
      return ((n1*p1)/(n2*p2))*p2/p1;
    },
  }
  if (!(type in typMap)) { return console.error('运算符错误: ', type); }
  
  let d1 = getDecimal(num1)
  let d2 = getDecimal(num2)
  let deci = decimal?decimal:2;
  return Number( typMap[type](num1,num2,d1,d2).toFixed(deci) ) 
}
/*** 精确四则运算 方式2: 转换成数组进行模拟运算 
* @params  xxx  type,参数说明
* @return  type,返回值说明 
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
export function preciseCalc2(type,num1,num2,decimal){
  /* 
  type     KW,运算类型: '+' '-' '*' '/' 
  num1     num,操作数1 
  num2     num,操作数2 
  decimal  int,保留小数位,默认:2 
  */
  let typMap = { 
    '+': function(arr1,arr2,d1,d2){ 
      if (!arr1.isNegative && !arr2.isNegative) {
        let d = Math.max(d1,d2)
        let upN = 0; 
        let result = arr1.map((itm,idx)=>{
          let val = itm*1 + arr2[idx]*1;
          val += upN; 
          upN = Math.floor(val/10); 
          val %= 10; 
          return val; 
        }).reverse() 
        if (d!==0) { result.splice(-d,0,'.') }
        return result.reduce((retVal,itm)=>retVal+itm, '') * 1  + 
          upN * Math.pow(10, arr1.length-d1 )
      }
      else if (arr1.isNegative && arr2.isNegative) {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['+'](arr1,arr2,d1,d2) * -1;
      }
      else if (arr1.isNegative) {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['-'](arr2,arr1,d1,d2);
      }
      else {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['-'](arr1,arr2,d1,d2);
      }
    }, 
    '-': function(arr1,arr2,d1,d2){ 
      if (!arr1.isNegative && !arr2.isNegative) {
        let d = Math.max(d1,d2)
        let downN = 0; 
        let result = arr1.map((itm,idx)=>{
          let val = itm*1 - arr2[idx]*1;
          val += downN; 
          downN = Math.floor(val/10); 
          val = (val+10)%10
          return val; 
        }).reverse() 
        if (d!==0) { result.splice(-d,0,'.') }
        return result.reduce((retVal,itm)=>retVal+itm, '')*1 + 
          downN * Math.pow(10,arr1.length-d1)
      }
      else if (arr1.isNegative && arr2.isNegative) {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['-'](arr2,arr1,d1,d2);
      }
      else if (arr1.isNegative) {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['+'](arr1,arr2,d1,d2) *-1;
      }
      else {
        arr1.isNegative = false; 
        arr2.isNegative = false; 
        return this['+'](arr1,arr2,d1,d2);
      }
    }, 
    '*': function(arr1,arr2,d1,d2){ 
      // 
    }, 
    '/': function(arr1,arr2,d1,d2){ 
      
    },
  }
  if (!(type in typMap)) { return console.error('运算符错误: ', type); }
  
  // 
  let d1 = getDecimal(num1); 
  let d2 = getDecimal(num2); 
  
  let arr1 = num1.toString().replace(".", "").split('').reverse()
  let arr2 = num2.toString().replace(".", "").split('').reverse()
  // 去除符号,作为标记存储  
  if (num1<0) {
    arr1.pop()
    arr1.isNegative = true; 
  }
  else {
    arr1.isNegative = false; 
  }
  if (num2<0) {
    arr2.pop()
    arr2.isNegative = true; 
  }
  else {
    arr2.isNegative = false; 
  }
  // 将小数位个数相等 
  let delta = d1 - d2; 
  if (delta>0) {
    while (delta>0) {
      delta--;
      arr2.unshift(0)
    }
  }
  else if (delta<0) {
    while (delta<0) {
      delta++;
      arr1.unshift(0)
    }
  }
  // 将整体长度相等 
  delta = arr1.length - arr2.length; 
  if (delta>0) {
    while (delta>0) {
      delta--;
      arr2.push(0)
    }
  }
  else if (delta<0) {
    while (delta<0) {
      delta++;
      arr1.push(0)
    }
  }
  
  let deci = decimal?decimal:2;
  return Number( typMap[type](arr1,arr2,d1,d2).toFixed(deci) ) 
}



/*** 工具方法: 一位数乘多位数 
* @params  xxx  type,参数说明
* @return  type,返回值说明 
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
function multiply(num,arr){
  let n = 0; 
  let result = arr.sort(()=>-1).map( (itm,idx)=>{
    let val = itm*num; 
    val += n;
    n = Math.floor(val/10); 
    return val %= 10; 
  })
  if (n!==0) { result.push(n); }
  return result.sort(()=>-1);
}


/* ===================================================================== 测试 */
export function test(){
  
  console.log( multiply(7, [3,4,2,3]), 7*3423 );
  console.log(' ----------------------------------------------------  ');
  
  
  console.log( preciseCalc1('+',2.0,1,9), 2.0 + 1, );
  console.log( preciseCalc1('+',0.1,0.2,9), 0.1 + 0.2, );
  console.log( preciseCalc1('-',0.3,0.1,9), 0.3 - 0.1, );
  console.log( preciseCalc1('*',0.2,0.1,9), 0.2 * 0.1, );
  console.log( preciseCalc1('*',0.3,3,9), 0.3 * 3, );
  console.log( preciseCalc1('/',0.3,0.2,9), 0.3 / 0.2, );
  console.log(' ----------------------------------------------------  ');
  console.log( preciseCalc2('+',2.0,1,9), 2.0 + 1, );
  console.log( preciseCalc2('+',0.1,0.2,9), 0.1 + 0.2, );
  console.log( preciseCalc2('+',2.0,-1,9), 2.0 - 1, );
  console.log( preciseCalc2('+',0.1,-0.2,9), 0.1 - 0.2, );
  console.log( preciseCalc2('-',0.1,0.3,9), 0.1 - 0.3, );
  
  
} 


