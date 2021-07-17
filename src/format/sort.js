/** 数组排序 
* @params  targetArr    arr,将被排序的数组 
* @params  referKey     str,成员的键值,用来做排序参照 
* @params  valOrderArr  arr,参照键值 排序的顺序数组 
* @return  arr,返回排好序的数组 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
- 01 详细说明1 
* -----------------------------
* @todo  
- 1 代办事项1 
*/
export default function sort(targetArr,referKey,valOrderArr){
  let keyOrderMap = { }
  valOrderArr.forEach((itm,idx)=>{ keyOrderMap[itm] = idx; })
  return [...targetArr].sort((itm1,itm2)=>{
    return keyOrderMap[itm1[referKey]] - keyOrderMap[itm2[referKey]];
    // return 小于0则两元素调序
  })
} 



/* ===================================================================== 测试 */
export function test(){
  let targetArr = [
    {
      xx1: 'hello',
    },
    {
      xx1: 'bb',
    },
    {
      xx1: '1',
    },
    {
      xx1: 100,
    },
  ];
  let valOrderArr = [ 100, '1', 'hello', 'bb' ];
  console.log( targetArr, valOrderArr );
  console.log( sort( targetArr , 'xx1', valOrderArr ) );
  
  
} 


