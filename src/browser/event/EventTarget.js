/*** 扩展原生事件功能 EventTarget  
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

/* 进行备份 覆盖默认的事件绑定方式 */
EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener; 
/*** 定义更强大的原生事件绑定方式 
* @params  evtName       str,事件名称 
* @params  listener      fn,事件响应回调 
* @params  options       bol/obj,配置项 
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
EventTarget.prototype.addEventListener = function(evtName,listener,options){
  // 保存事件回调 
  if (!this.evtNameListenerMap) { this.evtNameListenerMap = {} }
  if ( !this.evtNameListenerMap[evtName] ) { this.evtNameListenerMap[evtName] = [] }
  this.evtNameListenerMap[evtName].push(listener)
  
  // 
  this._addEventListener(evtName,listener)
}

/*** 扩展功能: 可立即触发一次回调   
* @params  evtName       str,事件名称 
* @params  listener      fn,事件回调 
* @params  immediateWay  bol,可选,立即响应的方式,默认:不立即响应,0:原生触发方式,1:仅执行回调 
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
EventTarget.prototype.addListener = function(evtName,listener,immediateWay){
  
  // 保存事件回调 
  if (!this.evtNameListenerMap) { this.evtNameListenerMap = {} }
  if ( !this.evtNameListenerMap[evtName] ) { this.evtNameListenerMap[evtName] = [] }
  this.evtNameListenerMap[evtName].push(listener)
  
  // 
  this._addEventListener(evtName,listener)
  
  // 立即触发 
  this.emitListeners(evtName,null,immediateWay);
}

/*** 扩展功能: 可解决匿名函数无法解绑事件的问题  
* @params  evtName?   str,可选,不存在则移除所有监听  
* @params  listener?  fn,可选,存在则只移除当前事件,否则移除所有该类事件 
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
EventTarget.prototype.offListeners = function(evtName,listener){
  // 无事件绑定 
  if (!this.evtNameListenerMap) { return ; }
  
  // 无参数,默认移除所有事件 
  if (!evtName) {
    for(var key in this.evtNameListenerMap){
      let lsns = this.evtNameListenerMap[key];
      if (lsns && lsns.length>0) {
        lsns.forEach(fn=>this.removeEventListener(evtName,fn))
      }
    };
    this.evtNameListenerMap = {}
    return ;
  }
  
  let listeners = this.evtNameListenerMap[evtName]; 
  // 无该类事件绑定 
  if (!listeners) { return ; }
  
  // 未指定事件名,解绑该事件所有监听  
  if (!listener) {
    listeners.forEach(fn=>this.removeEventListener(evtName,fn));
    this.evtNameListenerMap[evtName] = [];
  }
  // 解绑指定事件 
  else {
    this.removeEventListener(evtName,listener)
    this.evtNameListenerMap[evtName] = listeners.filter(itm=>itm!==listener);
  }
}

/*** 扩展功能: 触发事件 
* @params  evtName?  str,可选,事件名称,不存在则触发所有事件的所有监听 
* @params  data?     any,可选,传递的数据 
* @params  emitWay?  0/1,触发方式,默认:0  
* @return  / 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 可自定义传递的数据;  
* 选择触发方式: 是否需要原始事件效果,或者只是执行响应回调 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
EventTarget.prototype.emitListeners = function(evtName,data,emitWay){
  if (!this.evtNameListenerMap) { return ; }
  
  let evts = [];
  if (!evtName) {
    for(var key in this.evtNameListenerMap){ evts.push(key) };
  }
  else { evts.push(evtName) }
  
  let emitWayMap = {
    /* 原生触发方式,将获得原生事件效果 */
    0: ()=>{ 
      evts.forEach((itm,idx)=>{
        let evt = new Event(itm);
        // 传递自定义数据, 不使用 data 字段,避免和原生事件的data冲突  
        evt.msg = data; 
        this.dispatchEvent(evt);
      });
    },
    /* 仅执行回调 */
    1: ()=>{ 
      evts.forEach((itm,idx)=>{
        let evt = new Event(itm);
        // 传递自定义数据, 不使用 data 字段,避免和原生事件的data冲突  
        evt.msg = data; 
        let listeners = this.evtNameListenerMap[itm]; 
        listeners && listeners.forEach(fn=>fn(evt))
      });
    },
  }
  let emtW = emitWay || 0;
  emitWayMap[emitWay]();
  
}




/* 测试  */
export function test(){
  document.addEventListener("click",function(evt){
    console.log('document click',evt);
    
  })
  // document.addListener("click",function(evt){
  //   console.log('document click');
  // },0)
  setTimeout(function(){
    console.log('setTimeout run');
    document.emitListeners('click',{key1: 1231231,});
    // document.offListeners('click')
  },5000)

} 


