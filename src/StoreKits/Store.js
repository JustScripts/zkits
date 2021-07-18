/* 存储封装,状态集中管理 
特点: 
  可跨页面 缓存数据, 
*/

const instances_key = Symbol('instances');
const callbacks_key_flg = Symbol('callbacks_key');

// 
const store_instances = {
  // <store_key>: instance,
}
export default class Store {
  constructor(store_key, initValue=null, trimFn ){ 
    this._key = store_key;
    // 初始值 
    this._initValue = initValue;
    // 格式化函数 
    this._trim = trimFn || function(val){ return val; };
    
    this._value = this._initValue;
    // 缓存格式化的值 
    this._trimedValue = this._trim(this._value);
    this._preValue = null; 
    this._preTrimedValue = this._trim(this._preValue); 
  }
  
  /* --------------------------------------------------------- APIs */
  // 使用 
  static use(store_key, initValue, trimFn){
    // 必须指定key 
    if (!store_key) { throw new Error('store key is not define'); }
    
    // 已定义,则直接使用
    let instance = this[instances_key][store_key];
    if ( instance ) { return instance; }
    
    // 未定义时,初始定义后使用 
    instance = new this(store_key, initValue, trimFn);
    this[instances_key][store_key] = instance;
    return instance;
  }
  // 取值 
  get = (isTrimed=true, isClear=false)=>{
    if ( isTrimed ) {
      let trimedResult = this._trimedValue;
      if ( isClear ) { this.clear() }
      return trimedResult; 
    }
    
    let result = this._value; 
    if ( isClear ) { this.clear() }
    return result; 
  }
  // 写值 
  set = (val)=>{
    // 重复设置相同值,不处理 
    if ( val===this._value ) { return ; }
    
    this._preValue = this._value;
    this._preTrimedValue = this._trimedValue;
    this._value = val; 
    this._trimedValue = this._trim( val ); 
    this[callbacks_key_flg].forEach((listenRun, idx)=>{
      listenRun(
        this._value, 
        this._preValue, 
        this._trimedValue, 
        this._preTrimedValue
      );
    })
  }
  // 清除 
  clear = ()=>{ this.set( this._initValue ); }
  // 监听 
  listen = (listenRun, immediate=false)=>{
    if ( typeof listenRun!=='function' ) {
      throw new Error('first argument is not a function');
    }
    
    this[callbacks_key_flg].push( listenRun );
    if ( immediate ) {
      listenRun(
        this._value, 
        this._preValue, 
        this._trimedValue, 
        this._preTrimedValue
      );
    }
  }
  
  
  /* --------------------------------------------------------- DATAs */
  // 实例集合 
  static [instances_key] = store_instances;
  // 监听函数集 
  [callbacks_key_flg] = [];
}

// 
const store_map_instances = {
  // 
}
export class StoreMap extends Store {
  constructor(store_key, initValue={}, trimFn){
    super(store_key, initValue, trimFn);
  }
  
  /* --------------------------------------------------------- APIs */
  key = (k, v)=>{
    this.set({
      ...this.get(false, false),
      [k]: v, 
    })
  }
  
  /* --------------------------------------------------------- DATAs */
  // 实例集合 
  static [instances_key] = store_map_instances;
}






/** -------------------------------------------------------------- test */
export function test(){
  let key01 = Symbol('key1');
  
  const st = Store.use(key01, 'init');
  st.get();
  st.set('111');
  st.listen((val, pre, valTrimed, preTrimed)=>{ 
    console.log( val, pre);
  }, true); 
  // st.clear();
  
  const ms = StoreMap.use(key01)
  ms.listen((val, pre, valTrimed, preTrimed)=>{ 
    console.log( val, pre);
  }, true); 
  ms.key('a', 1)
  // ms.clear();
  
} 







