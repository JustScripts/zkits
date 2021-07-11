/** 弹性回弹 
* @params  wrapElem  Node,弹性容器元素
* @params  overCallback  fn,弹性状态释放时的回调
* @params  isScroll  bol,是否只有滚动时才生效,默认:true
* @return  /  
* -----------------------------
* @author  fsl 
* @time    2021.07.10 
* -----------------------------
* @detail  
- 01 主要针对非IOS设备,实现非IOS的拖拉回弹效果  
* -----------------------------
* @todo  
- 1 代办事项1 
*/

const max_spring_len = 100; // 最大弹性高度,unit: px 
const safe_len = 2; // 安全距离 
export default function pullBackSpring(wrapElem, overCallback, isScroll=true){
  if ( !wrapElem ) { return console.error('undefined elem of pull spring back'); }
  let contentElem = wrapElem.firstElementChild;
  if ( !contentElem ) { return console.error('undefined child elem of pull spring back'); }
  
  overCallback = overCallback || function (isDwn, moveNum){
    console.log( isDwn, moveNum);
  };
  
  let startY = null;
  let moveY = null; 
  let isDown = true;
  let isEffect = false;
  function moveElem(wrap, elem, len, isPullDown=true){
    // console.log(' -- ', moveY);
    if ( isPullDown ) {
      wrap.scrollTop = 0;
      if ( len >= max_spring_len ) { moveY = max_spring_len }
      if ( len <= 0 ) { moveY = 0 }
      elem.style['transform'] = `translateY(${moveY}px)`;
      return ;
    }
    
    wrap.scrollTop = wrap.scrollHeight-wrap.clientHeight;
    if ( len >= 0 ) { moveY = 0 }
    if ( len <= -max_spring_len ) { moveY = -max_spring_len }
    elem.style['transform'] = `translateY(${moveY}px)`;
  } 
  function scrollAbled(elem){
    return elem.scrollHeight>elem.clientHeight;
  } 
  function touchStart(evt){
    let toucher = evt.targetTouches[0];
    startY = toucher.screenY; 
  } 
  function wrapScroll(evt){ 
    let isScrollTop = wrapElem.scrollTop <= safe_len; 
    let isScrollBtm = wrapElem.scrollTop >= wrapElem.scrollHeight - wrapElem.clientHeight - safe_len; 
    if ( 
      ( !isScrollTop && !isScrollBtm )
      || ( isScrollTop&&moveY<0 )
      || ( isScrollBtm&&moveY>0 )
    ){
      
    }
    else {
      startY = null; 
    }
  } 
  function touchMove(evt){
    if ( isScroll && !scrollAbled(wrapElem) ) { return ; }
    
    evt.preventDefault();
    let toucher = evt.targetTouches[0];
    if ( startY ===null ) { startY = toucher.screenY; }
    moveY = toucher.screenY - startY;
    
    let isScrollTop = wrapElem.scrollTop <= safe_len; 
    let isScrollBtm = wrapElem.scrollTop >= wrapElem.scrollHeight - wrapElem.clientHeight - safe_len; 
    // scroll 
    let bol1 = !isScrollTop && !isScrollBtm 
    let bol2 = isScrollTop&&moveY<0 
    let bol3 = isScrollBtm&&moveY>0 
    let isShowScroll = bol1 || bol2 || bol3;
    if ( isShowScroll ) {
      isEffect = false; 
      wrapElem.scrollTop = -moveY;
      console.log( -moveY );
      moveY = 0; 
      contentElem.style['transform'] = `translateY(${moveY}px)`;
      console.log('scroll', moveY, wrapElem.scrollTop, isShowScroll, !isScrollTop , !isScrollBtm );
      return ;
    }
    
    // move 
    isEffect = true; 
    isDown = isScrollTop;
    moveElem(wrapElem, contentElem, moveY, isScrollTop);
    console.log('move', moveY, wrapElem.scrollTop, isShowScroll);
    
  } 
  function touchEnd(evt){
    if ( isEffect ) { overCallback( isDown, moveY ); }
    moveY = 0;
    contentElem.style['transform'] = `translateY(${moveY}px)`;
  } 
  wrapElem.addEventListener("touchstart", touchStart)
  wrapElem.addEventListener("touchmove", touchMove)
  // wrapElem.addEventListener("scroll", wrapScroll)
  wrapElem.addEventListener("touchend", touchEnd)
  
  return function clearEvents(){
    wrapElem.removeEventListener("touchstart",touchStart)
    wrapElem.removeEventListener("scroll",wrapScroll)
    wrapElem.removeEventListener("touchmove",touchMove)
    wrapElem.removeEventListener("touchend",touchEnd)
  };
} 



/* ---------------------------------------------------------------- 测试 */
export function test(){
  // pullBackSpring(document.body);
  pullBackSpring( document.body.querySelector(".wrap"), (type,num)=>{
    // alert( type )
    console.log("000000000 ", type, num)
  } );
  
} 