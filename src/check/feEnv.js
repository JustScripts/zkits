/* ** 前端环境监测 */ 

/*** 获取操作系统名称 
* @params  / 
* @return  KW,操作系统名称 
* unkonwn windows mac linux android ios 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export function getOSName(){  
  let os = 'unkonwn'
  
  let userAgent = navigator.userAgent.toLowerCase() 
  let appVersion = navigator.appVersion.toLowerCase() 
  // let vendor = navigator.vendor.toLowerCase() 
  // let platform = navigator.platform.toLowerCase() 
  let list = [
    { rgep: /win/i, testVal: appVersion, name: 'windows', },
    { rgep: /mac/i, testVal: appVersion, name: 'mac', },
    { rgep: /linux/i, testVal: appVersion, name: 'linux', },
    { rgep: /android/i, testVal: userAgent, name: 'android', },
    { rgep: /iphone/i, testVal: userAgent, name: 'ios', },
    { rgep: /ipad/i, testVal: userAgent, name: 'ios', },
    { rgep: /ipod/i, testVal: userAgent, name: 'ios', },
  ]
  let item = list.find(itm=>itm.rgep.test(itm.testVal) )
  if (item) { os = item.name }
  
  return os
}

/*** 获取浏览器名称&版本  
* @params  / 
* @return  obj,浏览器类型和版本 
* { name: <str>, version: <str>, }
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export function getBrowserInfo(){  
  let result = { name: 'unkonwn', version: 'unkonwn', }
  
  let ua = navigator.userAgent.toLowerCase() 
  let browserList = [
    { 
      name: 'chrome', 
      rgep: /chrome\/([\d\.]+)/, 
      version: 'unkonwn', 
    },
    { 
      name: 'ie', 
      rgep: /rv:([\d.]+)\) like gecko/, 
      version: 'unkonwn', 
    },
    { 
      name: 'ie', 
      rgep: /msie ([\d\.]+)/, 
      version: 'unkonwn', 
    },
    { 
      name: 'edge', 
      rgep: /edge\/([\d\.]+)/, 
      version: 'unkonwn', 
    },
    { 
      name: 'firefox', 
      rgep: /firefox\/([\d\.]+)/, 
      version: 'unkonwn', 
    },
    { 
      name: 'opera', 
      rgep: /(?:opera|opr).([\d\.]+)/, 
      version: 'unkonwn', 
    },
    { 
      name: 'safari', 
      rgep: /version\/([\d\.]+).*safari/, 
      version: 'unkonwn', 
    },
  ]
  let browser = browserList.find(itm=>{ 
    let matchs = ua.match(itm.rgep) 
    // console.log( matchs );
    if ( matchs ) { itm.version = matchs[1] }
    return matchs 
  } )
  if ( browser ) {
    result = { name: browser.name, version: browser.version, }
  }
  
  return result; 
}

/*** 是否为IE 
* @params  / 
* @return  bol,是否为IE 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export function isIE(){ 
  if (!!window.ActiveXObject || "ActiveXObject" in window){ return true; }
  
  return false; 
}

/*** 是否为低版本IE [IE7、8、9 之一]  
* @params  num,可选,7/8/9  
* @return  bol,是否为指定的IE版本 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export function isLowerIE(num){ 
  let elemB = document.createElement('b');
  if (num) { elemB.innerHTML = '<!--[if IE ' + num + ']><i></i><![endif]-->'; }
  else {
    elemB.innerHTML = '<!--[if IE 7]><i></i><![endif]-->'
    elemB.innerHTML += '<!--[if IE 8]><i></i><![endif]-->'
    elemB.innerHTML += '<!--[if IE 9]><i></i><![endif]-->'
  }
  return elemB.getElementsByTagName('i').length>0;
}



/*** 浏览器是否支持webP格式图片 
* @params  / 
* @return  bol,是否支持webP格式图片 
* -----------------------------
* @author  fsl 
* @time    时间值 
* -----------------------------
* @detail  
* 01 详细说明1 
* -----------------------------
* @update  
* 时间值 更新说明 
*/
export function webPIsAbled(){ 
  let cvs = document.createElement('canvas');
  return cvs.toDataURL && cvs.toDataURL('image/webp').indexOf('data:image/webp')===0;
  //  .toDataURL 方法,判断是否 IE9+ 
}




/* 测试 */
export function test(){
  console.log( getOSName() );
  console.log( getBrowserInfo() );
  console.log( isIE() );
  console.log( isLowerIE() );
  console.log( webPIsAbled() );
} 