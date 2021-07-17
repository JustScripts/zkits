




对象的索引键可以为引用类型 referenceKey 

mapObj = {
  referenceKey: val,
}


维持一个索引对象 indexObj =  {
  uuid: {
    index: referenceKey,
    value: val,
  } 
}

使用 referenceKey 来索引时, 查询 indexObj 得到 uuid 对应的项的值, 从而得到 查询的值   






