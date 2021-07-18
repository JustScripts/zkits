/* todo: 
本地存储封装,状态集中管理 
特点: 
  可跨页面 缓存数据, 使用后, 便于清除 
*/


const store_instance_map = {
  // <store_key>: instance,
}
const callbacks_key_flg = Symbol('callbacks_key');
export default class Store {
  constructor(store_key, initValue=null, trimFn ){ 
    trimFn = trimFn || function(val){ return val; };
    this.key = store_key;
    // 初始值 
    this.initValue = initValue;
    // 格式化函数 
    this.trim = trimFn;
    this.value = initValue;
    // 缓存格式化的值 
    this._trimedValue = null;
  }
  
  /* --------------------------------------------------------- APIs */
  // 初始定义 
  static define(store_key, initValue, trimFn){
    // 禁止重复定义 
    if ( store_instance_map[store_key] ) {
      let errMsg = `#fd store key has defined`;
      console.error(errMsg, store_key);
      throw errMsg;
    }
    
    // 定义store
    let storeInstance = new this(store_key, initValue, trimFn);
    store_instance_map[store_key] = storeInstance;
    return storeInstance;
  }
  // (初始)使用 
  static use(store_key, initValue, trimFn){
    let store = store_instance_map[store_key];
    if ( !store ) {
      // 未定义时,禁止直接使用 
      if (initValue===undefined) {
        let errMsg = `#fd store key is not define`;
        console.error(errMsg, store_key);
        throw errMsg;
      }
      
      // 未定义时,可初始定义 
      return this.define(store_key, initValue, trimFn);
    }
    
    return store;
  }
  /* --------------------------------------------------------- APIs */
  get = (isTrimed=true, isClear=false)=>{
    let result = this.value; 
    if ( !isTrimed ) { 
      if ( isClear ) { this.clear() }
      return result; 
    }
    
    let trimedResult = this._trimedValue;
    if (trimedResult!==null) { 
      if ( isClear ) { this.clear() }
      return trimedResult; 
    }
    
    trimedResult = this.trim( this.value );
    this._trimedValue = trimedResult;
    if ( isClear ) { this.clear() }
    return trimedResult; 
  }
  set = (val)=>{
    let preV = this.get();
    this.value = val; 
    this._trimedValue = null; 
    this[callbacks_key_flg].forEach((listenRun,idx)=>{
      listenRun(val, preV);
    })
  }
  clear = ()=>{ this.set( this.initValue ); }
  [callbacks_key_flg] = [];
  listen = (listenRun)=>{
    this[callbacks_key_flg].push( listenRun )
  }
}
export class MapStore extends Store {
  constructor(store_key, initValue={}, trimFn){
    super(store_key, initValue, trimFn);
  }
  
  key = (k, v)=>{
    this.set({
      ...this.get(false),
      [k]: v, 
    })
  }
}
/** -------------------------------------------------------------- test */
export function test(){
  let key01 = Symbol('key1');
  let store = Store.define(key01, {});
  store = Store.use(key01, {});
  store.listen((val, pre)=>{ 
    console.log( val, pre);
  }); 
  store.get();
  store.set('111');
  // store.clear();
  
  let key02 = Symbol('key2');
  let ms = MapStore.use(key02, {})
  ms.listen((val, pre)=>{ 
    console.log( val, pre);
  }); 
  ms.key('a', 1)
  
} 







