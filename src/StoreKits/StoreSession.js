/* todo: 
sessionStorage 存储封装 
*/


const callbacks_key_flg = Symbol('callbacks_key');
export default class StoreSession {
  constructor(store_key, initValue=null, trimFn){ 
    this._key = store_key;
    // 初始值 
    this._initValue = initValue;
    // 格式化函数 
    this._trim = trimFn || function(v){ return v; };
    
    this._value = JSON.parse( sessionStorage.getItem(store_key) );
    if ( this._value===null ) {
      this._value = this._initValue;
      sessionStorage.setItem(store_key, JSON.stringify( this._value ));
      
      this._preValue = null; 
      this._preTrimedValue = this._trim(this._preValue);
    }
    else {
      this._preValue = this._value; 
      this._preTrimedValue = this._trim(this._preValue);
    }
    // 缓存格式化的值 
    this._trimedValue = this._trim(this._value);
  }
  
  /* --------------------------------------------------------- APIs */
  // 使用 
  static use(store_key, initValue, trimFn){
    // 必须指定key 
    if (!store_key) { throw new Error('store key is not define'); }

    let instance = new this(store_key, initValue, trimFn);
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
    try {
      if ( JSON.stringify(val)===JSON.stringify(this._value) ) { return ; }
    } 
    catch (err) { 
      console.warn(err); 
      return ;
    } 

    this._preValue = this._value;
    this._preTrimedValue = this._trimedValue;
    this._value = val; 
    this._trimedValue = this._trim( val ); 
    sessionStorage.setItem( this._key, JSON.stringify(this._value) );
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

    this[callbacks_key_flg].push( listenRun )
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
  [callbacks_key_flg] = [];
}
export class SessionMap extends StoreSession {
  constructor(store_key, initValue={}, trimFn){
    if ( typeof initValue!=='object' ) {
      throw new Error('initValue is not a map value');
    }
    super(store_key, initValue, trimFn);
  }
  
  /* --------------------------------------------------------- APIs */
  key = (k, v)=>{
    this.set({
      ...this.get(false, false),
      [k]: v, 
    })
  }
}



/* ** ------------------------------------------------------- test */
export function test(){
  const st = StoreSession.use('key_001', '01');
  // st.get();
  // st.set('aaa');
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }, true); 
  // st.clear();
  
  const ms = SessionMap.use('key_002')
  ms.set({});
  ms.key('a', 111);
} 
export function test1(){
  const st = StoreSession.use('key_001', '01');
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }); 
  // st.set('bbb');
  // st.clear();
  
  const ms = SessionMap.use('key_002' )
  console.log( ms.get() );
} 







