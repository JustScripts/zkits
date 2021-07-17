/* todo: 
本地存储封装,状态集中管理 
特点: 
  可跨页面 缓存数据, 使用后, 便于清除 
*/


const keys_map = {
  // <store_key>: instance,
}
export default class Store {
  constructor(store_key, initValue=null, trim ){ 
    trim = trim || function(val){ return val; };
    this.key = store_key;
    // 初始值 
    this.initValue = initValue;
    // 格式化函数 
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
  /* --------------------------------------------------------- APIs */
  get = (isTrimed=false)=>{
    if (!isTrimed) { return this.value; }
    
    if (this._trimedValue!==null) { return this._trimedValue; }
    
    this._trimedValue = this.trim( this.value );
    return this._trimedValue; 
  }
  set = (val)=>{
    let preV = this.get();
    this.value = val; 
    this._trimedValue = null; 
    this._listenCallbacks.forEach((listenRun,idx)=>{
      listenRun(val, preV);
    })
  }
  clear = ()=>{ this.set( this.initValue ); }
  _listenCallbacks = [];
  listen = (listenRun)=>{
    this._listenCallbacks.push( listenRun )
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







