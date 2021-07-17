import Pledge from "./Pledge.js";
import Chain from "./Chain.js";
import Callthen from "./Callthen.js";


export {
  Pledge,
  Chain,
  Callthen,
};



if (globalThis.window) {
  window.Pledge = Pledge;
  window.Chain = Chain;
  window.Chain = Callthen;
}
else {
  global.Pledge = Pledge;
  global.Chain = Chain;
  global.Callthen = Callthen;
}

/* ===================================================================== 测试 */
export function test(){
  
  console.log( globalThis.Pledge.name );
  
} 





