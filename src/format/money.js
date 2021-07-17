// 处理输入的金额 
function dealMoney(money){
  if (!money) { return []; }
  
  money += '';
  money = money.match(/^\d*\.?\d*/)[0] || '0';
  let mArr = money.split('.')
  mArr = mArr.slice(0,2);
  
  return mArr;
} 



/*** 金额格式化 
* @params  money      str/num,待格式化的字符串或数值 
* @params  splitStep  num,分割的位数,默认:3  
* @params  decimalNum num,格式化小数位,默认:2  
* @params  intNum     num,格式化整数位[使用0补全],默认:0 表示不补全  
* @params  splitStr   str,分割的符号,默认:',' 
* @params  isRound    bol,小数位是否为四舍五入模式,默认:true 
* @return  str,格式化后的金额的字符表示 
* -----------------------------
* @author  fsl 
* @time    2020年5月10日 11:40:46 
* -----------------------------
* @detail  
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export default function main(money, splitStep=3, decimalNum=2, intNum=0, splitStr=',', isRound=true){
  let mArr = dealMoney(money);
  let integer = main_int(mArr[0], splitStep, intNum, splitStr);
  let decimals = main_dec(mArr[1], decimalNum, isRound);
  
  return integer+decimals;
}
/* 处理整数部分 */
function main_int(integer, splitStep, intNum, splitStr){
  integer = integer || '0'
  if (intNum && intNum>integer.length ) { integer = '0'.repeat(intNum-integer.length) + integer; }
  // 使用正则处理 失败 
  // let matchs = /^(\d{0,2}?)(\d{3})*$/.exec(integer) 
  let idx = integer.length%splitStep; 
  let pre = integer.slice(0,idx);
  let rest = integer.slice(idx)
  rest = rest.split( new RegExp(`(\\d{${splitStep}})`) )
  rest = rest.filter(itm=>itm)
  rest = rest.reduce((retVal,itm)=>retVal+splitStr+itm, '' )
  let result = pre + rest 
  if (!pre) { result = rest.slice(1) }
  
  return result;
} 
/* 处理小数部分 */
function main_dec(decimals, decimalNum, isRound){
  decimals = decimals || '';
  decimals += '000000000000000000000';
  // 小数位四舍五入  
  let next = decimals.slice(decimalNum,decimalNum+1)
  // 小数位直接取到指定长度 
  decimals = decimals.slice(0,decimalNum)
  if (isRound && next>=5) { decimals++; }
  if (decimals) { decimals = '.'+decimals; }
  
  return decimals;
} 



/*** 金额转换为汉字 
* @params  money      str/num,待格式化的字符串或数值 
* @params  decimalNum num,格式化小数位,默认:2  
* @params  isRound    bol,小数位是否为四舍五入模式,默认:true 
* @return  str,转换后的字符串表示 
* -----------------------------
* @author  fsl 
* @time    2020年5月10日 11:42:04 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
let cUpperNum = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
let cIntUnit = {
  1:  'num',
  2:  '拾',
  3:  '佰',
  4:  '仟',
  5:  '万',
  6:  '拾',
  7:  '佰',
  8:  '仟',
  9:  '亿',
  10: '拾',
  11: '佰',
  12: '仟',
  13: '兆',
  14: '拾',
  15: '佰',
  16: '仟',
}
let cDecUnit = ['分', '毫', '厘',]
export function chinese(money, decimalNum=2, isRound=true){
  let mArr = dealMoney(money);
  let integer = ch_int(mArr[0]);
  let decimals = ch_dec(mArr[1], decimalNum=2, isRound=true)
  
  return integer+decimals;
} 
/* 处理整数部分 */
function ch_int(integer){ 
  integer = integer || '0'; 
  integer = integer.replace(/^0+/,'')
  let arr = integer.split('');
  let len = arr.length; 
  if (len>16) { return '数据过大' }
  
  let zeroFlg = true; 
  let rstArr = arr.map((itm,idx)=>{
    let cNum = cUpperNum[itm]
    let i = len - idx;
    let cUnit = cIntUnit[ i ]
    
    if (cUnit.length>1) { return cNum } // 个位数 
    
    if (cNum=='零') { 
      if ( i==5 || i==9 || i==13 ) { 
        if (zeroFlg) { 
          zeroFlg = false; 
          return cNum+cUnit; 
        }
        
        
        return cUnit;
      }
      
      if (zeroFlg) { 
        zeroFlg = false; 
        return cNum; 
      }
      return ''; 
    }
    
    
    return cNum + cUnit; 
  })
  
  if (!rstArr.length) { return '零元' }
  
  let result = rstArr.reduce((retVal,itm)=>retVal+itm, '' ) + '元'
  // result = result.replace(/x+/,'零')
  // result = result.replace(/x+/g,'')
  return result;
} 
/* 处理小数部分 */
function ch_dec(decimals, decimalNum=2, isRound=true){ 
  decimals = decimals || ''
  let arr = decimals.split('')
  let rstArr = arr.map((itm,idx)=>{
    let cNum = cUpperNum[itm]
    let cUnit = cDecUnit[ idx ]
    if (cNum=='零') { return '' }
    
    return cNum+cUnit;
  })
  return rstArr.reduce((retVal,itm)=>retVal+itm, '' ) 
} 








/* ===================================================================== 测试 */
let fnMap = {
  main(){
    console.log( main(  ) );
    console.log( main( '0' ) );
    console.log( main( 'a' ) );
    console.log( main( '.3' ) );
    console.log( '-----------------------------------------' );
    console.log( main( 1 ) );
    console.log( main( 12 ) );
    console.log( main( 123 ) );
    console.log( main( 1234 ) );
    console.log( main( 12345 ) );
    console.log( main( 123456 ) );
    console.log( main( 1234567 ) );
    console.log( main( 12345678 ) );
    console.log( main( 123456789 ) );
    console.log( main( 1234567890 ) );
    console.log( '-----------------------------------------' );
    console.log( main( 1, 4 ) );
    console.log( main( 12, 4 ) );
    console.log( main( 123, 4 ) );
    console.log( main( 1234, 4 ) );
    console.log( main( 12345, 4 ) );
    console.log( main( 123456, 4 ) );
    console.log( main( 1234567, 4 ) );
    console.log( main( 12345678, 4 ) );
    console.log( main( 123456789, 4 ) );
    console.log( main( 1234567890, 4 ) );
    console.log( '-----------------------------------------' );
    console.log( main( 1.5671234, 3, 0 ) );
    console.log( main( 1.5671234, 3, 2 ) );
    console.log( main( 1.5671234, 3, 3 ) );
    console.log( main( 12.5671234, 3, 3 ) );
    console.log( main( 123.5671234, 3, 3 ) );
    console.log( main( 1234.5671234, 3, 3 ) );
    console.log( main( 12345.5671234, 3, 3 ) );
    console.log( main( 123456.5671234, 3, 3 ) );
    console.log( main( 1234567.5671234, 3, 3 ) );
    console.log( main( 12345678.5671234, 3, 3 ) );
    console.log( main( 123456789.5671234, 3, 3 ) );
    console.log( main( 1234567890.5671234, 3, 3 ) );
    console.log( '-----------------------------------------' );
    console.log( main( 1.5671234, 3, 3, 10) );
    console.log( main( 12.5671234, 3, 3, 10) );
    console.log( main( 123.5671234, 3, 3, 10) );
    console.log( main( 1234.5671234, 3, 3, 10) );
    console.log( main( 12345.5671234, 3, 3, 10) );
    console.log( main( 123456.5671234, 3, 3, 10) );
    console.log( main( 1234567.5671234, 3, 3, 10) );
    console.log( main( 12345678.5671234, 3, 3, 10) );
    console.log( main( 123456789.5671234, 3, 3, 10) );
    console.log( main( 1234567890.5671234, 3, 3, 10) );
    console.log( '-----------------------------------------' );
    console.log( main( 1.5671234, 3, 2, 10, ',', true) );
    console.log( main( 1.5671234, 3, 2, 10, ',', false) );
    console.log( '-----------------------------------------' );
  },
  chinese(){
    console.log( chinese( 1) );
    console.log( chinese( 11) );
    console.log( chinese( 111) );
    console.log( chinese( 1111) );
    console.log( chinese( 11001) );
    console.log( chinese( 111111) );
    console.log( chinese( 1111111) );
    console.log( chinese( 11111111) );
    console.log( chinese( 1111111111) );
    console.log( chinese( 11111111111) );
    console.log( chinese( 1020305105160071.123) );
    console.log( chinese( '1020305105160071.123') );
  },
}
export function test(fnName='main'){
  fnMap[fnName]();
} 



