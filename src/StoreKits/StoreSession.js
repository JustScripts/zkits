/* todo: 
sessionStorage 存储封装 
*/


const callbacks_key_flg = Symbol('callbacks_key');
export default class StoreSession {
  constructor(store_key, initValue, trimFn){ 
    this.key = store_key;
    // 初始值 
    this.initValue = initValue;
    // 格式化函数 
    this.trim = trimFn || function(v){ return v; };
    
    this._value = JSON.parse( sessionStorage.getItem(store_key) );
    if ( this._value===null ) {
      this._value = this.initValue;
      sessionStorage.setItem(store_key, JSON.stringify(this.initValue));
    }
    // 缓存格式化的值 
    this._trimedValue = this.trim(this._value);
  }
  
  /* --------------------------------------------------------- APIs */
  static use(store_key, initValue, trimFn){
    let instance = new this(store_key, initValue, trimFn);
    
    return instance;
  }
  get = (isTrimed=true, isClear=false)=>{
    if ( isTrimed ) {
      let result = this._trimedValue;
      if ( result!==null ) { return this._trimedValue; }
      
      this._trimedValue = this.trim( this.value );
      return this._trimedValue; 
    }
    
    
  }
  set = (val)=>{
    let preV = this.get();
    this._trimedValue = null; 
    this._value = val; 
    this[callbacks_key_flg].forEach((listenRun,idx)=>{
      listenRun(val, preV);
    })
  }
  clear = ()=>{ 
    this.set( this.initValue ); 
  }
  [callbacks_key_flg] = [];
  listen = (listenRun)=>{
    this[callbacks_key_flg].push( listenRun )
  }
  
}
export class SessionMap extends StoreSession {
  constructor(...args){
    super(...args)
  }
}



/* ** ------------------------------------------------------- test */
export function test(){
  const store = Store.use('key_001', '01');
  store.get();
  store.set();
  store.clear();
  store.listen((val, pre)=>{ }); 
} 







