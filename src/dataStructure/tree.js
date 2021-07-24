/* ** 树接口数据的工具方法 
*/


export default class TreeKit {
  constructor(childrenField="children"){ 
    this.childrenField = childrenField;
  }
  
  /* --------------------------------------------------------- APIs */
  static define(...args){ return new this(...args); }
  /* 深度优先 */
  // 递归写法 
  traversal_deep_recur = (node, cb)=>{
    if (!node) { return ; }
    
    cb && cb(node);
    let children = node[ this.childrenField ]
    if (!children) { return ; }
    
    children.forEach(itm=>traversal_deep_recur(itm,cb));
  }
  // 非递归写法 
  traversal_deep_unrecur = (node,cb)=>{
    if (!node) { return ; }
    
    let list = [node];
    while (list.length>0) {
      let item = list.shift();
      cb && cb(item); 
      let children = item[this.childrenField];
      if (!children || children.length===0) { continue; }
      
      list.splice(0,0,...children)
    }
  }
  /* 广度优先 */
  // 递归写法 
  traversal_wide_recur = (node,cb)=>{ 
    if (!node) { return ;}
    
    let nextList = []
    if (!(node instanceof Array)) { node = [node]; }
    node.forEach(itm=>{
      cb && cb(itm)
      if (!itm[this.childrenField]) { return ;}
      
      nextList.push(...itm.children) 
    })
    if (nextList.length==0) { return ; }
    
    traversal_wide_recur(nextList, cb)
  }
  // 非递归写法 
  traversal_wide_unrecur = (node,cb=>) {
    if (!node) { return ; }
    
    let list = [node];
    while (list.length>0) {
      let item = list.shift();
      cb && cb(item);
      let children = item[this.childrenField];
      if (!children) { continue; }
      
      list.push(...children);
    }
  }
}

