/* localStorage 存储封装 
人为避免重复定义 
  实例统一入口文件定义 
  使用 '/' 符号, 定义命名空间 
过期控制 
  num  num秒后失效,方案: 始终储存为一对象值, 通过一个键值来定义有效时间 
  <=0  永久有效 
*/


const name_space = 'ztl';
const callbacks_key_flg = Symbol('callbacks_key');
export default class StoreLocal {
  constructor(store_key, initValue=null, timeout=0, trimFn){ 
    this._key = `${name_space}/${store_key}`;
    // 初始值 
    this._initValue = initValue;
    // 格式化函数 
    this._trim = trimFn || function(val){ return val; };
    
    timeout = Number(timeout);
    this._timeout = timeout ? timeout : 0;
    
    this._value = JSON.parse( localStorage.getItem(this._key) );
    if ( this._value===null ) {
      this._value = {
        start: Date.now(),
        timeout: this._timeout, 
        isOutTime: false, // 是否已超时 
        v: this._initValue,
      };
      localStorage.setItem(this._key, JSON.stringify( this._value ));
      
      this._preValue = null; 
      this._preTrimedValue = this._trim(this._preValue);
    }
    else {
      this._value.timeout = this._timeout;
      this._preValue = this._value.v; 
      this._preTrimedValue = this._trim(this._preValue);
    }
    // 缓存格式化的值 
    this._trimedValue = this._trim(this._value.v);
  }
  
  /* --------------------------------------------------------- APIs */
  // 使用 
  static use(store_key, initValue, timeout, trimFn){
    // 必须指定key 
    if (!store_key) { throw new Error('store key is not define'); }

    let instance = new this(store_key, initValue, timeout, trimFn);
    return instance;
  }
  // 取值 
  get value(){ return this.get(); }
  get = (isTrimed=true, handleFlg )=>{
    this.checkIsTimeout();
    
    // 是否单次有效: 单次有效即,本窗口存在,关闭后清除 
    if ( handleFlg==='once' ) {
      let result = JSON.parse( sessionStorage.getItem( this._key ) );
      if (result===null) {
        result = this._value.v; 
        sessionStorage.setItem(this._key, JSON.stringify(result));
        this.clear(); 
      }
      if (isTrimed) { return this._trim(result); }
      return result;
    }
    
    let isClear = handleFlg==='clear';
    if ( isTrimed ) {
      let trimedResult = this._trimedValue;
      if ( isClear ) { this.clear() }
      return trimedResult; 
    }
    
    let result = this._value.v; 
    if ( isClear ) { this.clear() }
    return result; 
  }
  // 写值 
  set value(val){ return this.set(val); }
  set = (val, isRefresh=true)=>{
    // 重复设置相同值,不处理 
    try {
      if ( JSON.stringify(val)===JSON.stringify(this._value.v) ) { return ; }
    } 
    catch (err) { return console.warn(err); } 
    
    this.checkIsTimeout();

    this._preValue = this._value.v;
    this._preTrimedValue = this._trimedValue;
    this._value = {
      ...this._value, 
      v: val,
    }; 
    if ( isRefresh ) { 
      this._value.start = Date.now();
      this._value.isOutTime = false; 
    }
    this._trimedValue = this._trim( val ); 
    localStorage.setItem( this._key, JSON.stringify(this._value) );
    this[callbacks_key_flg].forEach((listenRun, idx)=>{
      listenRun(
        this._value.v, 
        this._preValue, 
        this._trimedValue, 
        this._preTrimedValue
      );
    })
  }
  // 清除 
  clear = ()=>{ this.set( this._initValue, false ); }
  // 监听 
  listen = (listenRun, immediate=false)=>{
    if ( typeof listenRun!=='function' ) {
      throw new Error('first argument is not a function');
    }

    this[callbacks_key_flg].push( listenRun )
    if ( immediate ) {
      this.checkIsTimeout();
      listenRun(
        this._value.v, 
        this._preValue, 
        this._trimedValue, 
        this._preTrimedValue
      );
    }
  }

  /* --------------------------------------------------------- DATAs */
  [callbacks_key_flg] = [];
  /* --------------------------------------------------------- KITs */
  // 检查是否在有效期内 
  checkIsTimeout = ()=>{ 
    if ( this._value.isOutTime ) { false; }
    if ( this._value.timeout===0 ) { return true; }
    let outTime = this._value.start + this._timeout*1000;
    if ( outTime - Date.now() > 0 ) { return true; }
    
    this.clear();
    this._value.isOutTime = true; 
    return false;
  }
}
export class LocalMap extends StoreLocal {
  constructor(store_key, initValue={}, timeout, trimFn){
    if ( typeof initValue!=='object' ) {
      throw new Error('initValue is not a map value');
    }
    super(store_key, initValue, timeout, trimFn);
  }
  
  /* --------------------------------------------------------- APIs */
  key = (k, v)=>{
    this.set({
      ...this.get(false),
      [k]: v, 
    })
  }
}


/* ** ------------------------------------------------------- test */
const st = StoreLocal.use('a/key_001', '01', 60);
const ms = LocalMap.use('a/key_002')
export function test(){
  // st.get();
  // st.set('aaa');
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }, true); 
  // st.clear();
  
  // ms.set({});
  ms.key('a', 111);
} 
export function test1(){
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }); 
  // st.set('bbb');
  // st.clear();
  
  console.log( ms.get() );
} 





