

/* 自定义的回调转链式调用 */
class Callthen {
  constructor(targetFn,args1=[],args2=[]){ 
    if (typeof targetFn !== 'function') { 
      throw new Error('Callthen first argument is not a function') 
    }
    
    // 功能0 
    this._follow = ()=>{}
    
    // 功能1
    this._access = ()=>{}
    
    // 功能2 
    this._answer = ()=>{}
    
    // 功能3 
    this._always = ()=>{}
    
    // 功能4
    this._once = ()=>{}
    
    // 功能5 
    this._thenList = []
    this._thenIdx = 0,
    this._over = ()=>{}
    
    setTimeout(()=>{
      this.result = targetFn(...args1,(...args)=>{
        let response; 
        if ( this._access(...args)!==false ) {
          response = this._answer(...args);
          
          // 
          if (!this._onceFlg) {
            this._onceFlg = true;
            this._once(...args); 
          }
          
          // 
          this._thenList.forEach(itm=>{ itm.ready = true; }) // 重置状态 
          let firstThen = this._thenList[0];
          firstThen && firstThen.fn.apply(firstThen,args);
        }
        
        this._always(...args);
        
        return response;
      },...args2);
      
      this._follow(this.result);
    })
  }
  
  // 实例化后&准备就绪后,紧接着执行一次 
  follow(fn){  // 【不可添加多个】
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
  
  
  then(fn){
    let that = this;
    this._thenList.push({
      fn: fn,
      ready: true,
      idx: that._thenIdx, // 固化序号 
      nextItm(){ return that._thenList[this.idx+1]; },
      call(...args){ 
        let nextItm = this.nextItm();
        if (nextItm && nextItm.ready) {
          nextItm.ready = false; // 防止重复执行 
          nextItm.fn.apply(nextItm,args);
        }
      },
      done(...args){ 
        let nextItm = this.nextItm();
        if (nextItm.ready) { 
          nextItm.ready = false; // 后续不再执行 call/done 
          that._over(...args); 
        } 
      },
    });
    this._thenIdx++;
    return this;
  }
  over(fn){  // 【不可添加多个】
    this._over = fn;
    return this;
  }
}

export default Callthen; 



/* ===================================================================== 测试 */
export function test(){
  // new Callthen(document.addEventListener,['click'])
  
  if (globalThis.process) {
    new Callthen(process.stdin.on.bind(process.stdin),['data'])
    .then(function(data){
      console.log('then1',data);
      
      this.done('aaa');
      this.call(2);
      setTimeout(()=>{
        this.call(1111);
        //this.call(1);
      },1000)
    })
    .then(function(data){
      console.log('then2',data);
      this.call(3);
    })
    .then(function(data){
      console.log('then3',data);
      setTimeout(()=>{
        this.call(4)
      },1000)
    })
    .then(function(data){
      console.log('then4',data);
    })
    .over(function(err){ 
      console.log('over1',err);
    });
  }
  else {
    new Callthen(document.addEventListener.bind(document),['click'])
    .then(function(data){
      console.log('then1',data);
      
      this.done('aaa');
      this.call(2);
      setTimeout(()=>{
        this.call(1111);
        //this.call(1);
      },1000)
    })
    .then(function(data){
      console.log('then2',data);
      this.call(3);
    })
    .then(function(data){
      console.log('then3',data);
      setTimeout(()=>{
        this.call(4)
      },1000)
    })
    .then(function(data){
      console.log('then4',data);
    })
    .over(function(err){ 
      console.log('over1',err);
    });
  }
  
} 




