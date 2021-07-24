// 自定义事件 

function ZK_Event(){
  this.msg = '自定义的事件对象'
  this.store = {};
}
ZK_Event.prototype = {
  // constructor: EventTarget,
  
  /*** 监听事件  
  * @params  evtName   str,监听的事件名 
  * @params  listener  fn,响应的回调 
  * @return  / 
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
  listen(evtName,listener){
    if ( !this.store[evtName] ) { this.store[evtName] = [] }
    this.store[evtName].push(listener);
  },
  
  /*** 触发事件  
  * @params  evtName  str,触发的事件名称 
  * @params  data     any,触发传递的数据 
  * @return  / 
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
  strike(evtName,data){
    var listeners = this.store[evtName];
    
    if (!listeners || listeners.length==0 ) {
      console.warn(`no ${evtName} to strike`);
      return ;
    }
    
    listeners.forEach(itm=>{ itm(data); }) 
  },
  
  /*** 移除事件绑定  
  * @params  evtName   str,移除的事件名称 
  * @params  listener  fn,可选,移除指定的事件监听 
  * @return  / 
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
  remove(evtName,listener){
    var listeners = this.store[evtName];
    
    if ( !listeners || listeners.length==0 ) {
      console.warn(`no exit ${eventName} to remove`);
      return ;
    }
    
    if (listener) {
      this.store[evtName] = listeners.filter( val=>val!==listener );
      return ;
    }
    
    this.store[evtName] = []; 
  },
}

export default ZK_Event;



/* ------------------------------------------------------------- 测试 */
export function test(){
  
  let myET = new ZK_Event();
  myET.listen('tst',function(evt){
    console.log(evt);
  })
  let siId = setInterval(()=>{ myET.strike('tst', {key:11}) },500)
  setTimeout(()=>{ 
    myET.remove('tst') 
    setTimeout(()=>{ clearInterval(siId) },1000)
  },3000)
} 
















