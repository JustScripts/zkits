/*** 自定义log ,收口: 方便集中管理  
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

let num = 0;
let style = `
  border-bottom: 1px solid #000;`;
let typMap = {
  string: {
    placeholder: '%c%s',
    style: style+`color: #C10007;`
  },
  number: {
    placeholder: '%c%d',
    style: style+`color: #231BA7;`
  },
  object: {
    placeholder: '%c%o',
    style: style
  },
}
export default function main(...args){
  num++;
  if (args.length<=1) {
    let type = (typMap[typeof args[0]] || { placeholder: '%c%s', style, });
    console.log('%c%s'+type.placeholder, 'font-weight: bold;', `${num}:`, type.style, args[0]);
    return ;
  }
  
  console.group(`${num}:`);
  // console.groupCollapsed()
  args.forEach((itm,idx)=>{
    let type = (typMap[typeof itm] || { placeholder: '%c%s', style, });
    console.log(type.placeholder, type.style, itm);
  })
  console.groupEnd();
};


/* ==================================================================== 测试  */
export function test(){
  main()
  main(undefined)
  main(null)
  main(NaN)
  main('')
  main(' ')
  main('a')
  main('a')
  main('a')
  main([1,2])
  main({key:'a'})
  main(/a/)
  main('a', 'b')
  main('a', 'b', 'c')
} 


