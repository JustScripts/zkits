/* ** 获取图片尺寸信息 
// @param  imgSrc,str,图片(绝对)地址
// @param  styles,obj,可选,初始样式定义
// @param  timeout,num,超时时间,默认:5分钟
// @return  promise->({ 
//   width: <num>,
//   height: <num>,
//   ...
// })
*/

export default function getImgSize(imgSrc,styles={},timeout=1000*60*5){
  if (!imgSrc) { return Promise.reject('undefined img src'); }
  
  return new Promise((resolve,reject)=>{
    let status = 'init';
    let imgElem = document.createElement("img");
    imgElem.style['padding'] = '0';
    imgElem.style['border'] = 'none';
    for(let key in styles){
      imgElem.style[key] = styles[key];
    };
    imgElem.style['position'] = 'fixed';
    imgElem.style['z-index'] = '-99';
    imgElem.style['top'] = '-100%';
    imgElem.style['left'] = '-100%';
    imgElem.addEventListener("load", (evt)=>{
      let elem = evt.currentTarget;
      resolve({
        width: elem.clientWidth,
        height: elem.clientHeight,
        elem,
      });
      status = 'resolved'
      setTimeout(()=>{ document.body.removeChild(imgElem); })
    });
    imgElem.addEventListener("error", (evt)=>{
      reject('load error');
      status = 'rejected'
      document.body.removeChild(imgElem);
    })
    imgElem.src = imgSrc;
    document.body.appendChild(imgElem);
    setTimeout(()=>{
      if (status!=='init') { return ; }
      reject('timeout');
      status = 'rejected'
      document.body.removeChild(imgElem);
    },timeout)
  });
} 




/* ---------------------------------------------------------------- 测试 */
export function test(){
  getImgSize('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile.juzimi.com%2Fweibopic%2Fjxzpmo5.jpg&refer=http%3A%2F%2Ffile.juzimi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628482589&t=993e2b17e4c0697cdea64702fabf08e7',{
    width: '100vw',
  })
  .then((data)=>{
    console.log( data );
  })
} 