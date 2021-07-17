/* todo: 
sessionStorage 存储封装 
*/


import {
  isMapValue, 
} from "../../utils/judge.js";

const session_local_store_key = '#fd_store';
const keys_map = {
  // <store_key>: instance,
}
export default class Store {
  constructor(store_key, options={}){ 
    this.key = store_key;
    this.options = options;
    let {
      // '01'-内存,'02'-sessionStorage, '03'-localStorage [todo]
      cacheType = '01', 
      // 初始值 
      initValue = null, 
      // 格式化函数 
      trim = function(val){ return val; },
      // 初始是否清除之前的缓存,针对 sessionStorage 和 localStorage  
      initClear = false, 
      // 超时时间,单位:s , 针对 localStorage 
      timeout = 24 * 60 * 60,
    } = options || {};
    this.cacheType = cacheType;
    this.initValue = initValue;
    this.initClear = initClear;
    this.timeout = timeout;
    this.trim = trim;
    this.value = initValue;
    // 缓存格式化的值 
    this._trimedValue = null;
  }
  
  /* --------------------------------------------------------- APIs */
  static define(store_key, options){
    if ( keys_map[store_key] ) {
      let errMsg = `#fd store key has defined ${store_key}`;
      console.error(errMsg);
      throw errMsg;
    }
    
    let storeInstance = new Store(store_key, options);
    if (storeInstance._isSession) {
      // storeInstance._setSessionStorage(storeInstance.initValue);
      // storeInstance._setSessionStorage(storeInstance._getSessionStorage);
      storeInstance.set(storeInstance._getSessionStorage, true, false);
    }
    keys_map[store_key] = storeInstance;
    return storeInstance;
  }
  static use(store_key){
    let store = keys_map[store_key];
    if ( !store ) {
      let errMsg = `#fd store key is not define: ${store_key}`;
      console.error(errMsg);
      throw errMsg;
    }
    
    return store;
  }
  
  
  /* --------------------------------------------------------- KITs */
  static _initEnv(){
    if ( !sessionStorage[session_local_store_key] ) {
      sessionStorage[session_local_store_key] = JSON.stringify({});
    }
    else {
      try {
        if ( !isMapValue(JSON.parse(sessionStorage[session_local_store_key])) ) {
          sessionStorage[session_local_store_key] = JSON.stringify({});
        }
      } 
      catch (err) { 
        console.error(err);
        sessionStorage[session_local_store_key] = JSON.stringify({});
      } 
    }
    
    if ( !localStorage[session_local_store_key] ) {
      localStorage[session_local_store_key] = JSON.stringify({});
    }
    else {
      try {
        if ( !isMapValue(JSON.parse(localStorage[session_local_store_key])) ) {
          localStorage[session_local_store_key] = JSON.stringify({});
        }
      } 
      catch (err) { 
        console.error(err);
        localStorage[session_local_store_key] = JSON.stringify({});
      } 
    }
  }
  get _isMemory(){ return this.cacheType==='01'; }
  get _isSession(){ return this.cacheType==='02'; }
  get _isLocal(){ return this.cacheType==='03'; }
  _getSessionStorage(){ 
    let obj = JSON.parse( sessionStorage[session_local_store_key] );
    return obj[this.key];
  }
  _setSessionStorage(val){ 
    let obj = JSON.parse( sessionStorage[session_local_store_key] );
    obj[this.key] = val; 
    sessionStorage[session_local_store_key] = JSON.stringify(obj);
  }
  _clearSessionStorage(){ }
  _setLocalStorage(){ }
  _getLocalStorage(){ }
  _clearLocalStorage(){ }
  /* --------------------------------------------------------- APIs */
  get = ()=>{
    if (this._trimedValue!==null) { return this._trimedValue; }
    
    this._trimedValue = this.trim( this.value );
    return this._trimedValue; 
  }
  set = (val, isSilent=false, isSync=true )=>{
    let preV = this.get();
    this.value = val; 
    this._trimedValue = null; 
    if (!isSilent) {
      this._listenCallbacks.forEach((listenRun,idx)=>{
        listenRun(val, preV);
      })
    }
    if (isSync) {
      if (this._isSession) { this._setSessionStorage(val); }
      if (this._isLocal) { this._setLocalStorage(val); }
    }
  }
  clear = ()=>{ 
    this.set( this.initValue ); 
    this._clearSessionStorage();
    this._clearLocalStorage();
  }
  _listenCallbacks = [];
  listen = (listenRun)=>{
    this._listenCallbacks.push( listenRun )
  }
}
Store._initEnv();
export class StoreSession {
  constructor(arg){ 
  }
}
export class StoreLocal {
  constructor(arg){ 
  }
}

/* ** -------------------------------------------------------
  const st = Store.define('key_001', { });

  const store = Store.use('key_001');
  store.get();
  store.set();
  store.clear();
  store.listen((val, pre)=>{ }); 
*/







