// 自定义的 Promise polyfill  
/* 与promise的差异 
  触发会执行多次,即使状态已改变后 
    new Pledge((res,rej)=>{
      res(); 
      res(); 
      rej(); 
      // 将执行3次,请手动避免 
    })
    
  // promise.finally & pledge.final 差异 
  //   pledge.final 原理 和 then/catch 类似，只是最终都会执行 且会接收传递值  
  //   pledge.final 会将err吃掉 改为不吃掉 
*/

class Pledge {
  constructor(fn){ 
    if (typeof fn !== 'function') { throw new Error('Pledge argument is not function'); }
    
    this.status = 'ready';  // 状态 'ready'，'resolved'，'rejected' 
    this._transfer;         // 传递值 
    this._cbList = [        // 回调列表 
      // {
      //   type: KW,  // catchCall thenCall finalCall 
      //   fn: fn,    // 执行的回调 
      //   pld: this, // 实例 
      // }
    ];
      
    // 需先将 _cbList 收集完毕 再执行 
    setTimeout(()=>{ 
      try {
        fn(
          (arg)=>{
            this.status = 'resolved';
            if (arg instanceof Pledge) { 
              let firstItm = this._cbList[0];
              firstItm && this._switchRun(firstItm,0,arg);
            }
            else { 
              this._transfer = arg; 
              this._cbListRun(0,'thenCall',arg); 
            }
          }
          ,(arg)=>{
            this.status = 'rejected';
            this._transfer = arg; 
            this._cbListRun(0,'catchCall',arg);
          }
        )
      } 
      catch (err) {
        this.status = 'rejected';
        this._transfer = err;
        this._cbListRun(0,'catchCall',err)
      } 
    })
  }
    
  then(fn1,fn2){
    this._cbList.push({ 
      type: 'thenCall', 
      fn: fn1,  
      pld: this, 
    })
    if (typeof fn2 === 'function') {
      this._cbList.push({ 
        type: 'catchCall', 
        fn: fn2,  
        pld: this, 
      });
    }
    return this;
  }
  catch(fn){
    this._cbList.push({ 
      type: 'catchCall', 
      fn: fn, 
      pld: this, 
    });
    return this;
  }
  final(fn){
    this._cbList.push({ 
      type: 'finalCall', 
      pld: this, 
      fn: fn, 
    });
    return this;
  }
  
  _cbListRun(currentIdx,currentType,currentVal){
    // currentVal   传递的数据,使用参数来避免未执行的回调无法传递 
    setTimeout(()=>{
      let itm = this._cbList[currentIdx];
      
      if (!itm) { // 再无后续的回调
        if (currentType==='catchCall') { throw currentVal; } // 最后存在未处理的错误 将其抛出 
        return ; 
      }
      
      let nextIdx = currentIdx + 1; 
      let nextItm = this._cbList[nextIdx];
      
      // 非执行的类型，继续下一调用 
      if (itm.type!==currentType && itm.type!=='finalCall') { 
        this._cbListRun(nextIdx,currentType,currentVal);
        return ;
      }
      
      try {
        let nextVal = itm.fn(currentVal); // 当前实例上执行调用 
        nextItm && (nextItm.pld = itm.pld); // 默认使用上一实例 
        if ( nextVal instanceof Pledge) { 
          // 【注意】 被继承时，this.constructor 为 子类, 导致bug 
          this._switchRun(nextItm,nextIdx,nextVal);
        }
        else { 
          nextItm && (nextItm.pld._transfer = nextVal);
          let nextType = 'thenCall'; 
          if (itm.type==='finalCall') { // final 不改变执行及传递数据 
            nextType = currentType; 
            nextVal = currentVal;
          }
          this._cbListRun(nextIdx,nextType,nextVal); // 执行未出错，继续执行后续回调 
        }
      } 
      catch (runErr) {
        nextItm && (nextItm.pld._transfer = runErr);
        this._cbListRun(nextIdx,'catchCall',runErr); 
      } 
      
    })
  }
  _switchRun(itm,idx,pld){
    if (!itm) {return ; }
    
    itm.pld = pld;
    itm.pld._cbList = this._cbList.slice(idx); // 更新后续的回调集 
    if (itm.pld._cbList[0]) { itm.pld._cbList[0].pld = pld; } // 改变初始的实例,实例默认向后沿用 
    
    let typeMap = { rejected:'catchCall', resolved:'thenCall', ready: 'ready', }
    let itmType = typeMap[pld.status];
    // done 状态 
    if (itmType!=='ready') { 
      pld._cbListRun(0,itmType,pld._transfer); 
    } 
    // 否则等待切换的实例自动调用已更新的回调集 
  }
  
  static resolve(val){
    if (val instanceof this) { return val; }
    
    return new this((resolve,reject)=>{
      resolve(val)
    });
  }
  static reject(val){
    if (val instanceof this) { return val; }
    
    return new this((resolve,reject)=>{
      reject(val);
    });
  }
  static all(list){
    return new this(function(res,rej){
      let num = list.length;
      let resList = [];
      list.forEach((itm,idx)=>{
        itm.then(data=>{
          num--;
          resList[idx] = data;
          if (num===0) { res(resList) }
        })
        .catch(err=>{
          rej(err)
        })
      })
    });
  }
  static race(list){
    return new this(function(res,rej){
      let isDone = false;
      list.forEach((itm,idx)=>{
        itm.then(data=>{
          if (!isDone) {
            isDone = true;
            res(data)
          }
        })
        .catch(err=>{ 
          if (!isDone) {
            isDone = true;
            rej(err)
          }
        });
      })
    });
  }
  static one(list){
    return new this((res,rej)=>{
      let num = list.length;
      let rjtList = [];
      list.forEach((itm,idx)=>{
        itm.then(data=>{ res(data) })
        .catch(err=>{
          num--;
          rjtList[idx] = err;
          if (num===0) { rej(rjtList); }
        })
      })
    });
  }
}

export default Pledge;







/* ===================================================================== 测试 */
export function test(){
  
  new Pledge(function(resolve,reject){
    reject(222);
    setTimeout(function(){
      resolve(111);
    },1000)
  })
  .then(data=>{
    console.log('then1',data);
    return 't1'
  })
  .catch(err=>{
    console.log('catch1',err);
    return 'c1'
  })
  .then(data=>{
    console.log('then2',data);
    return new Pledge(function(res,rej){
      setTimeout(function(){
        res( Pledge.reject(333) )
      },1000)
    })
  })
  .catch(err=>{
    console.log('catch2',err);
  })
  .then(data=>{
    console.log('then3',data);
  })
  // catch1 222 -> then2 c1 
  // --> then1 111 -> then2 t1 
  // -> catch2 333 -> then3 undefined 
  // -> catch2 333 -> then3 undefined 
  
} 



