/* sessionStorage 存储封装 
Feature: 
  人为避免重复定义 
    键值统一入口文件配置 或者 实例统一入口文件定义 
    使用 '/' 符号, 定义命名空间 
*/

const name_space = 'zk';
const callbacks_key_flg = Symbol('callbacks_key');
export default class StoreSession {
  constructor(store_key, dftVal=null, trimFn){ 
    this._key = `${name_space}/${store_key}`;
    // 初始值 
    this._dftVal = dftVal;
    // 格式化函数 
    this._trim = trimFn || function(v){ return v; };
    
    this._value = JSON.parse( sessionStorage.getItem(this._key) );
    if ( this._value===null ) {
      this._value = this._dftVal;
      sessionStorage.setItem(this._key, JSON.stringify( this._value ));
      
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
  static use(store_key, dftVal, trimFn){
    // 必须指定key 
    if (!store_key) { throw new Error('store key is not define'); }

    let instance = new this(store_key, dftVal, trimFn);
    return instance;
  }
  // 取值 
  get value(){ return this.get(); }
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
  set value(val){ return this.set(val); }
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
  clear = ()=>{ this.set( this._dftVal ); }
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
  constructor(store_key, dftVal={}, trimFn){
    if ( typeof dftVal!=='object' ) {
      throw new Error('dftVal is not a map value');
    }
    super(store_key, dftVal, trimFn);
  }
  
  /* --------------------------------------------------------- APIs */
  key = (k, v)=>{
    this.set({
      ...this.get(false, false),
      [k]: v, 
    })
  }
  isEmpty = ()=>{
    let objMap = this.get(true);
    return Object.keys(objMap).length===0
  }
}






/* ** ------------------------------------------------------- test */
export function test(){
  const st = StoreSession.use('a/key_001', '01');
  // st.get();
  // st.set('aaa');
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }, true); 
  // st.clear();
  
  const ms = SessionMap.use('a/key_002')
  ms.set({});
  ms.key('a', 111);
} 
export function test1(){
  const st = StoreSession.use('a/key_001', '01');
  // st.listen((val, pre, vt, pt)=>{ 
  //   console.log( val, pre, vt, pt );
  // }); 
  // st.set('bbb');
  // st.clear();
  
  const ms = SessionMap.use('a/key_002' )
  console.log( ms.get() );
} 







