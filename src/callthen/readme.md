<h3>less callback more orderliness</h3>
<h5>当回调中存在大量的操作时,可将其按执行流程拆分,使代码逻辑条理更清晰</h5>




example: 
```
  // 嵌入回调的情景1: 
  function recursionFn(num,cb){
    if ( num<=0 ) { return ; }
    
    cb(num);
    setTimeout(()=>{
      recursionFn(--num,cb);
    },1000)
  }

  // 一般调用 
  recursionFn(10,function(num){
    console.log(num);
    // do something .... 
  })

  // 改用 .then 的方式 链式调用 
  new Chain(recursionFn,[10])
  .then(([data])=>{
    console.log(data);
    
    // 当回调内逻辑过多, 拆分到下一个 then 中执行 
    return new Pledge((res,rej)=>{
      res(--data);
    })
  })
  .then((data)=>{
    console.log(data);
  })


  // 嵌入回调情景2: 
  document.addEventListener("click",function(evt){
    // do something 
  })

  // 改用 Chain, 将回调内的操作按流程改为多步操作 
  new Chain(document.addEventListener,['click'])
  .then(([evt])=>{
    console.log(evt);
    
    // 可后续 .then 执行 
    return new Pledge((resolve,reject)=>{
      resolve('next run');
    })
  })
  .then(data=>{
    console.log(data);
  })


```


<h3>使用说明</h3>

```
  const { Pledge, Chain, Callthen } = require('callthen'); // 引入 
  
  // Pledge 类似于 Promise 语法, 用于提供 .then .catch .final 接口 
  // 不同于 Promise, Pledge状态改变后,后续仍可执行 
  new Pledge((resove,reject)=>{
    let num = 0;
    setInterval(function(){
      resove(++num);
    },1000)
  })
  .then((num)=>{
    console.log(num);
  })
  // 1 2 ....    每秒打印一次 
  
  
  // Chain 使用见案例,将回调函数的逻辑 使用 .then 方法来拆分  
  
  
  // Callthen 用法如下: 
  new Callthen(document.addEventListener,['click'])
  .then(function(data){
    // 在回调中 执行 this.call() 或 this.done(), 通过这两个接口控制流程的进行  
    // 执行 this.call() 将继续执行下一条 then 中的回调,否则后续 then 不再执行  
    // 执行 this.done() 则将执行 over 中的回调[若存在的话], 程序进入终态 
    // 注: then 中不可使用箭头函数,箭头函数无法绑定 this 
    
    console.log('then1',data);
  
    this.call(2);
    this.done('aaa');
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
  .then(function(data){
    console.log('then4',data);
  })
  .over(function(err){ 
    console.log('over1',err);
  });
```






















