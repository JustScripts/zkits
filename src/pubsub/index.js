/* ** 订阅/发布 
Features: 
  channel 可为任意值(除函数及NaN外),推荐使用引用类型(比如 Symbol )避免重复 
  可同时发布到多个指定channel 
  可同时订阅多个指定channel  
  
  特殊的channel: AnyChannel, 
    发布 AnyChannel, 则表示发布所有channel
    订阅 AnyChannel, 则表示订阅所有Channel
*/

import {
  isArrayValue,
  isFunctionValue,
  isAbledChannel, 
  checkChannel, 
  ChannelStore,
  PSError,
  doAction, 
  doActionAsync, 
} from "./utils.js";

const any_channel = Symbol('any-channel');
const channel_store = new ChannelStore(any_channel);


export const AnyChannel = any_channel; // 最顶层频道 
export default class PubSub {
  constructor(channel, action){ 
    this.channel = channel; 
    this.action = action;
  }
  
  /* --------------------------------------------------------- KITs */
  
  /* --------------------------------------------------------- APIs */
  /* 定阅 
  channel   any/[any],消息频道,为数组的时,表示同时作用多个频道 
  action(channel, ...msgs),订阅回调响应 
  isImmediate  bol,是否立即回调最近一次的发布 
  */
  static sub(channel, action, isImmediate=false){
    channel = checkChannel(channel, any_channel);
    // any channel 逻辑 
    if ( channel===any_channel ) {
      const tocken1 = new this(channel, action);
      channel_store.insertAnyAction(tocken1);
      if (isImmediate) { action(channel, ...channel_store.anyChannel.lastMsgs) }
      return tocken1;
    }
    
    let tocken2 = new this(channel, action);
    let channelInstances = channel_store.insertAction(tocken2);
    channelInstances.map(channelItm=>{
      if (isImmediate) { action(channel, ...channelItm.lastMsgs); }
    })
    return tocken2;
  }
  // 发布 
  static pub(channel, ...msgs){
    channel = checkChannel(channel, any_channel);
    let resultList = [];
    // any channel 逻辑 
    let anyList = channel_store.pubAnyChannel(msgs, false);
    resultList.push(...anyList);
    if ( channel===any_channel ) {
      let list = channel_store.pubContentChannel(msgs, false);
      resultList.push(...list);
      return resultList;
    }
    
    let channelInstances = channel_store.fillLastMsg(channel, msgs);
    channelInstances.map(channelItm=>{
      let list = channelItm.tockenList.map(tockenItem=>{
        return doAction(channel_store.anyChannel, msgs, channelItm, tockenItem);
      })
      resultList.push(...list);
    })
    return resultList;
  }
  // 发布-异步 
  static pubAsync(channel, ...msgs){
    return Promise.resolve().then(()=>{
      let pmsList = [];
      channel = checkChannel(channel, any_channel);
      // any channel 逻辑 
      let anyList = channel_store.pubAnyChannel(msgs, true);
      pmsList.push(...anyList);
      if ( channel===any_channel ) {
        let list = channel_store.pubContentChannel(msgs, true);
        pmsList.push(...list);
        return Promise.all( pmsList );
      }
      
      let channelInstances = channel_store.fillLastMsg(channel, msgs);
      channelInstances.map(channelItm=>{
        let list = channelItm.tockenList.map(tockenItem=>{
          return doActionAsync(channel_store.anyChannel, msgs, channelItm, tockenItem);
        })
        pmsList.push(...list)
      })
      return Promise.all( pmsList );
    })
  }
  // 获取对应channel的action集合 
  static getActions(channel){
    channel = checkChannel(channel, any_channel);
    // any channel 逻辑 
    if (channel===any_channel) {
      let list1 = channel_store.getAnyAndContentActions();
      return list1;
    }
    
    let resultList = [];
    let channelItmList = channel_store.findChannels(channel);
    channelItmList.map(channelItm=>{
      let list = channelItm.tockenList.map(tockenItem=>tockenItem.action)
      resultList.push(...list);
    })
    return resultList;
  }
  // 取消指定定阅 
  static clearSubs(tokenOrChannelOrActionOrList){
    if (
      !( tokenOrChannelOrActionOrList instanceof this) && 
      !isAbledChannel(tokenOrChannelOrActionOrList) && 
      !isFunctionValue(tokenOrChannelOrActionOrList) && 
      !isArrayValue(tokenOrChannelOrActionOrList) 
    ) { return console.warn('error_argument_for_clear'); }
    
    // any channel 逻辑 
    if (
      tokenOrChannelOrActionOrList===any_channel || 
      (
        isArrayValue( tokenOrChannelOrActionOrList ) && 
        tokenOrChannelOrActionOrList.includes( any_channel )
      ) 
    ) { return channel_store.clearAnyAndConentSub(); }
    // any tocken 逻辑 
    if ( 
      tokenOrChannelOrActionOrList instanceof this && 
      tokenOrChannelOrActionOrList.channel===any_channel 
    ) {
      let action = tokenOrChannelOrActionOrList.action; 
      return channel_store.clearAnySub(tocken);
    }
    
    if (!isArrayValue(tokenOrChannelOrActionOrList)) {
      let tokenOrChannelOrAction = tokenOrChannelOrActionOrList;
      let channelName = null;
      let actionFn = null;
      let tocken = null; 
      // tocken
      if ( tokenOrChannelOrAction instanceof this ) {
        tocken = tokenOrChannelOrAction;
      }
      // action 
      else if ( isFunctionValue(tokenOrChannelOrAction) ) {
        actionFn = tokenOrChannelOrAction;
      }
      // channel 
      else {
        channelName = tokenOrChannelOrAction;
      }
      return channel_store.clearSub(tocken, channelName, actionFn);
    }
    
    if (tokenOrChannelOrActionOrList.length===0) { return console.warn('error_argument_for_clear'); }
    let resultList = [];
    tokenOrChannelOrActionOrList.map(itm=>{
      let listOrItm = this.clearSubs(itm);
      if (isArrayValue(listOrItm)) { resultList.push(...listOrItm) }
      else { resultList.push( listOrItm ) }
    });
    return resultList
  }
  // 错误处理 
  static onError(channel, errFn){
    channel = checkChannel(channel, any_channel);
    // any channel 逻辑 
    if (channel===any_channel) { return channel_store.insertAnyErrFns(errFn); }
    
    let channelInstances = channel_store.insertErrFns(channel, errFn);
    return channelInstances;
  }
  
  // 快捷定义 
  static use(channel){
    return {
      sub: this.sub.bind(channel), 
      pub: this.pub.bind(channel),
      pubAsync: this.pubAsync.bind(channel),
      getActions: this.getActions.bind(channel),
      clearSubs: this.clearSubs.bind(channel), 
      onError: this.onError.bind(channel),
    };
  }
}

/* --------------------------------------------------------- test */
export function test(){
  // 基本功能 
  var mySubscriber = function (msg, data) {
    console.log( msg, data );
  };
  var tocken01 = PubSub.sub('aa', mySubscriber);
  PubSub.pub('aa', 'hello world!');
  PubSub.pubAsync('aa', 'hello world!');
  
  
} 

