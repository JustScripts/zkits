/*** 状态<=>结果 配置化  
* @author  fsl 
* @time    时间值 
* -----------------------------
* @import   引入方式说明 
* @example  使用方式说明 
* -----------------------------
* @detail  
* 场景: 
*   当业务复杂,一个结果由多个状态值来确定, 
*   而大量存在该场景时,若每次都用条件来组合判断,冗余且逻辑散落未集中管理,导致开发、维护困难 
* 解决方案: 
*   定义: 多个状态值 和 多个结果值, 配置对应关系到一列表集合中 
*   查询: 将当前状态值和定义的状态值匹配,返回结果值 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export default class StateManager {
  /* 初始化,列出将会进行判断的所有状态 */
  constructor(stateList) {
    // 所有可能的状态场景,未枚举的将被忽略 
    this._stateList = stateList;  // ['st1', 'st2', ]
    
    // 状态结果数据中心: 用于判断状态对应的结果 
    this._StateResultList = [
      // {
      //   states: {
      //     st1: 'a',
      //     st2: 'b',
      //   },
      //   results: {
      //     rst1: 'A',
      //     rst2: 'B',
      //   },
      // },
    ]
    
    // 针对使用了vuex插件的vue项目,可将该功能集成到 store 中 
    let that = this;
    this._store = {
      state: { __sttrst__: that._StateResultList, },
      getters: {
        // 通过可传参的getters来获取 条件对应的操作 
        query({__sttrst__},getters){
          return function(rst,stateMap){
            return that.getter(rst,stateMap)
          }
        },
      },
      namespaced: true,
    }
  }
  
  /* 单条定义状态及结果 */
  setter(stateMap,resultMap){
    /* 
      设定状态时, 
      *   表示任意 
      !   取反 
      []  多个条件 
      Example: 
        {
          st1: '*',       // 表示任意状态值都可,默认:不填写的字段都为'*',
          st2: '!1'       // 取反,不为'1',都可以 
          st3: ['1','2'], // 状态值可为'1'、'2' 
        }
    */
    this._StateResultList.push({ states: stateMap, results: resultMap, })
  }
  /* 多条定义状态及结果 */
  setConfigs(configList){
    configList.forEach((itm,idx)=>{
      this.setter(itm[0],itm[1]);
    });
  }
  
  /* 查询 状态对应的结果 */
  getter(rst,stateMap){
    let rstMap = this._StateResultList.find(itm=>{ 
      return this._objInclude(itm.states,stateMap) 
    }) || {results:{},};
    return rstMap.results[rst];
  }
  
  /* 使用vuex时,接入store中 */
  install(store,mdName='stateManager'){
    store.registerModule(mdName,this._store)
  }
  
  // 条件集合包含关系判断: 条件少包含条件多 
  _objInclude(pObj,cObj){
    // { key1:1, } 相当于 { key1:1, key2: <*>, } 包含 { key1: 1, key2: 2, } 
    let bol = true; // 空对象{} 包含任意对象  
    
    for(var key in pObj){
      let val1 = pObj[key];
      // 查询的条件 未定义则表示为任意值 
      let val2 = cObj[key] || '*'; 
      
      // 配置的条件: * 任意 
      if (val1==='*') { continue; }  
      // 配置的条件: ! 非 
      if (val1[0]==='!') {
        val1 = val1.slice(1);
        // 无法确定包含关系,即不包含,直接跳出 
        if (val2==='*') {
          bol = false; 
          break;
        }
        if (val1===val2) { 
          bol = false; 
          break;
        }
        continue;
      }
      // 配置的条件: [] 数组 
      if (val1.includes('/')) {
        val1 = val1.split('/')
        // 无法确定包含关系,即不包含,直接跳出 
        if (val2==='*') {
          bol = false; 
          break;
        }
        
        if (!val1.includes(val2)) { 
          bol = false; 
          break;
        }
        continue;
      }
      // 配置的条件: 其他 
      if ( val2==="*" || val1!==val2 ) { 
        bol = false; 
        break;
      }
    };
    
    return bol;
  }
}



/* ===================================================================== 测试 */
export function test(){
  /* test StateManager */
  // 初始化配置  
  let stMg = new StateManager([ 
    'aa', // 条件a 
    'bb', // 条件b 
    'cc', // 条件c 
    'dd', // 条件d 
    'ee', // 条件e 
    'ff', // 条件f 
  ]);
  stMg.setConfigs([
    [
      // 表示 条件aa为'01'&条件bb为'01'&条件cc为'03', 对应的 hd1: '001', hd2: true 
      { aa: '01', bb: '01', cc: '03' },
      { hd1: '001', hd2: true, },
    ],
    [
      // 表示 aa条件为'02'时[其他条件任意],对应的 hd1: '222' 
      { aa: '02', },
      { hd1: '222', },
    ],
    [
      // 表示 cc 条件不为'02'时,对应的 hd1: '非02' 
      { cc: '!02', },
      { hd1: '非02', },
    ],
    [
      // 使用数组同时表示条件的多个值 
      { bb: ['02','03'], },
      { hd1: '非02', },
    ],
  ])
  stMg.setter(
    { aa: '01', bb: '02', },
    { hd1: true, hd2: '01', },
  )
  
  // console.log(stMg);
  
  console.log(stMg);
  let val1 = stMg.getter('hd1',{ aa: '01', bb: '01', cc: '03', dd: '01', }); 
  console.log( val1 ); // '001'   
  let val2 = stMg.getter('hd2',{ aa: '01' }); 
  console.log( val2 ); // undefined  
  let val3 = stMg.getter('hd1',{ aa: '01', bb: '01', cc: '03' }); 
  console.log( val3 ); // '001'  
  let val4 = stMg.getter('hd1',{ cc: '01' }); 
  console.log( val4 ); // '非02'  
  
  
  // // 针对于使用vue的项目,若使用了vuex,则可将该功能集成到 store 中 
  // stMg.install(vm.$store,'stateManager');  // 注册到store中 
  // vm.$store.getters['stateManager/query']('hd2',{
  //   aa: '01',
  //   bb: '02',
  // })
} 


