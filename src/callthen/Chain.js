import Pledge from "./Pledge.js";

// 自定义的回调转链式调用 
class Chain extends Pledge {
  constructor(targetFn,args1=[],args2=[]){ 
    if (typeof targetFn !== 'function') { 
      throw new Error('Chain first argument is not a function') 
    }
    
    let superRsv = ()=>{};
    super((rsv,rjt)=>{
      superRsv = rsv
    }); 
    
    // 功能1
    this._access = ()=>{}
    
    // 功能2 
    this._answer = ()=>{}
    
    // 功能3
    this._once = ()=>{}
    
    // 功能4 
    this._always = ()=>{}
    
    // 功能5 
    this._follow = ()=>{}
    
    setTimeout(()=>{
      this.result = targetFn(...args1,(...args)=>{
        if ( this._access(...args)!==false ) {
          this._back = this._answer(...args);
          
          superRsv(args); // 
          
          // 
          if (!this._onceFlg) {
            this._onceFlg = true;
            this._once(...args); 
          }
        }
        
        this._always(...args);
        
        return this._back;
      },...args2);
      
      this._follow(this.result);
    })
    
  }
  
  // 实例化后&准备就绪后,紧接着执行一次 
  follow(fn){
    typeof fn === 'function' && (this._follow = fn);
    return this;
  }
  
  // 控制【除always的】后续执行 
  access(fn){  // 【不可添加多个】 
    typeof fn === 'function' && (this._access = fn);
    return this;
  }
  // 控制回调函数的返回值 
  answer(fn){  // 【不可添加多个】
    typeof fn === 'function' && (this._answer = fn); 
    return this;
  }
  // 始终会执行的回调 
  always(fn){  // 【不可添加多个】
    typeof fn === 'function' && (this._always = fn); 
    return this;
  }
  
  // once及后续逻辑只执行一次 
  once(fn){    // 【不可添加多个】
    typeof fn === 'function' && (this._once = fn); 
    return this;
  }
  
  // static xxx(arg){
  //   return new this(setTimeout);
  // }
}

export default Chain;



/* ===================================================================== 测试 */
export function test(){
  if (globalThis.process) {
    new Chain(process.stdin.on.bind(process.stdin),['data'],[true])
    .then(([evt])=>{
      console.log(evt);
      // return 'bbb';
      return new Pledge((resolve,reject)=>{
        setTimeout(()=>{
          resolve('aaa')
        },2000)
      })
    })
    .then((data)=>{
      console.log(data);
    })
  }
  else {
    new Chain(document.addEventListener.bind(document),['click'],[true])
    .then(([evt])=>{
      console.log(evt);
      // return 'bbb';
      return new Pledge((resolve,reject)=>{
        setTimeout(()=>{
          resolve('aaa')
        },2000)
      })
    })
    .then((data)=>{
      console.log(data);
    })
  }
} 


