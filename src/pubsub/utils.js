// 是否为数组 
export function isArrayValue(val){
  return val instanceof Array;
} 
// 是否为函数 
export function isFunctionValue(val){
  return typeof val==='function';
} 
// 
export function isAbledChannel(val){
  if (Number.isNaN(val)) { return false; }
  if (isFunctionValue(val)) { return false }
  
  return true;
} 
// 格式化channel  
export function formatChannel(channelName){
  if (isArrayValue(channelName)) { 
    let resultList = [];
    channelName.forEach((itm, idx, list)=>{
      if ( !list.slice(idx+1).includes( itm ) ) {
        resultList.push( itm )
      }
    })
    return resultList;
  }

  return [ channelName ]
} 

function removeListItm(list, itm){
  let idx = list.findIndex(itm1=>{ 
    return itm1===itm 
  })
  if (idx!==-1) { return list.splice(idx,1)[0]; }
  return null;
} 
function removeListAllItm(list, itm, _rstList=[]){
  let idx = list.findIndex(itm1=>{ 
    return itm1===itm 
  })
  if (idx===-1) { return _rstList; }
  
  _rstList.push( ...list.splice(idx,1) )
  return removeListAllItm(list, itm, _rstList);
} 
function removeListAllItmFn(list, itmFn, _rstList=[]){
  let idx = list.findIndex( itm1=>itmFn(itm1) )
  if (idx===-1) { return _rstList; }
  
  _rstList.push( ...list.splice(idx,1) )
  return removeListAllItm(list, itmFn, _rstList);
} 

class Channel {
  constructor(channelName){ 
    this.channelName = channelName; 
    this.tockenList = [];
    this.lastMsgs = [];
    this.errFnList = [];
  }
}
export class ChannelStore {
  constructor(anyChannel){ 
    this.anyChannel = new Channel(anyChannel);
    this.content = [
      // 
    ];
  }
  findChannels = (channel)=>{
    let channelList = formatChannel(channel);
    if (channelList.length===0) { return []; }
    
    let newList = [];
    let resultList = channelList.map(channelNameItm=>{
      let result = this.content.find(itm=>itm.channelName===channelNameItm)
      if (result) { return result; }
      
      result = new Channel(channelNameItm);
      newList.push(result);
      return result;
    })
    this.content.push(...newList);
    return resultList;
  }
  
  insertAction = (tocken)=>{
    let cItmList = this.findChannels(tocken.channel);
    cItmList.forEach((itm,idx)=>{
      itm.tockenList.push(tocken);
    })
    return cItmList;
  }
  insertAnyAction = (tocken)=>{
    this.anyChannel.tockenList.push(tocken);
  }
  
  fillLastMsg = (channel, msgList)=>{
    let cItmList = this.findChannels(channel);
    cItmList.forEach((itm,idx)=>{
      itm.lastMsgs = msgList;
    })
    return cItmList;
  }
  pubAnyChannel = (msgs, isAsync=false)=>{
    let list1 = [];
    if (!isAsync) {
      list1 = this.anyChannel.tockenList.map((tockenItm,idx)=>{
        return doAction(this.anyChannel, msgs, this.anyChannel, tockenItm);
      })
    }
    else {
      list1 = this.anyChannel.tockenList.map((tockenItm,idx)=>{
        return doActionAsync(this.anyChannel, msgs, this.anyChannel, tockenItm);
      })
    }
    return list1;
  }
  pubContentChannel = (msgs, isAsync=false)=>{
    let resultList = [];
    if (!isAsync) {
      this.content.map((channelItm)=>{
        let lst = channelItm.tockenList.map((tockenItm,idx)=>{
          return doAction(this.anyChannel, msgs, channelItm, tockenItm);
        })
        resultList.push(...lst);
      })
    }
    else {
      this.content.map((channelItm)=>{
        let lst = channelItm.tockenList.map((tockenItm,idx)=>{
          return doActionAsync(this.anyChannel, msgs, channelItm, tockenItm);
        })
        resultList.push(...lst);
      })
    }
    return resultList
  }
  
  getAnyAndContentActions = ()=>{
    let resultList = [ ...this.anyChannel.tockenList ];
    this.content.map((channelItem,idx)=>{
      resultList.push( ...channelItem.tockenList )
    })
    return resultList;
  }
  
  clearSub = (tocken, channelName, actionFn)=>{
    if ( tocken!==null ) { 
      let itm = this.findChannels(tocken.channel)[0];
      return removeListItm(itm.tockenList, tocken); 
    }
    else if ( actionFn===null ) {
      let itm = this.findChannels(channelName)[0];
      let list = itm.tockenList;
      itm.tockenList = [];
      return list;
    }
    else {
      let removedList = [];
      this.content.forEach((channelItm,idx)=>{
        let rst = removeListAllItmFn(channelItm.tockenList, (itm)=>{
          return itm.action===actionFn;
        });
        removedList.push(...rst);
      })
      if (removedList.length===0) { return console.warn('undefined_action_for_clear'); }
      return removedList;
    }
  }
  clearAnySub = (tocken)=>{
    return removeListItm(this.anyChannel.tockenList, tocken);
  }
  clearAnyAndConentSub = ()=>{
    let itm1 = this.clearAnySub();
    let lst = [];
    this.content.map((channelItm,idx)=>{
      let l = channelItm.tockenList
      lst.push( ...l );
      channelItm.tockenList = [];
    })
    return [itm1, ...lst ];
  }
  
  insertErrFns = (channel, errFn)=>{
    let cItmList = this.findChannels(channel);
    cItmList.forEach((itm,idx)=>{
      itm.errFnList.push(errFn);
    })
    return cItmList;
  }
  insertAnyErrFns = (errFn)=>{
    this.anyChannel.errFnList.push(errFn)
    return this.anyChannel;
  }
}
// 处理检测channel为可用的规则 
export function checkChannel(channel, anyFlg){
  if ( !isAbledChannel(channel) ) { throw 'error_channel' }
  
  // any channel 只能单独使用, 避免不必要的错误(多次重复执行的问题) 
  if ( isArrayValue(channel)&&channel.includes(anyFlg) ) {
    console.warn('anychannel_only_onerror_alonely');
    channel = anyFlg
  }

  return channel;
} 
export class PSError {
  constructor(channel, msgs, action, err){ 
    this.channel = channel; 
    this.msgs = msgs; 
    this.action = action; 
    this.err = err; 
  }
}
export function doAction(anyChannel, msgs, channelItm, tocken){
  try { return tocken.action(tocken.channel, ...msgs); } 
  catch (err) {
    console.log(err);
    anyChannel.errFnList.forEach((errFn)=>{
      errFn(new PSError(tocken, msgs, err))
    })
    channelItm.errFnList.forEach((errFn)=>{
      errFn(new PSError(tocken, msgs, err))
    })
  } 
} 
export function doActionAsync(anyChannel, msgs, channelItm, tocken){
  return Promise.resolve().then(()=>tocken.action(tocken.channel, ...msgs)).catch((err)=>{
    console.log(err);
    anyChannel.errFnList.forEach((errFn)=>{
      errFn(new PSError(tocken, msgs, err))
    })
    channelItm.errFnList.forEach((errFn)=>{
      errFn(new PSError(tocken, msgs, err))
    })
    return Promise.reject(err);
  });
} 


