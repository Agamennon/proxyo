

var observable = require('../observer/observer').observable
var proxioMap = require('../observer/observer').proxioMap
var interceptMap = require('../observer/observer').interceptMap
//var State = require('../observer/observer').State
//var actionMap = new Map()
/*var Actions = new Proxy({
  Add:(namespace,fn)=>{
    this[namespace] = fn;
  }
},{
  get:(target, property, receiver)=>{
    console.log('getting action')
    //console.log(Reflect.get(target, property, receiver))
    return receiver,target[property]
    //return  Reflect.get(target, property, receiver)
  },
  set:(target, property, value, receiver)=>{
    console.log('setting action')
    console.log()
    return target[property] = value
  //  return Reflect.set(target, property,value,receiver)
  }
})*/

var Actions = new Map();

var intercept = function(target,method,property,interceptor){
  interceptMap.set(target,[method,property,interceptor])
  //console.log('intecepting target ',target)
}




/*
var Middelware = new Proxy ({},{
  get:(target, property, receiver)=>{

    return  Reflect.get(target, property, receiver)
  },
  set:(target, property, value, receiver)=>{

    return Reflect.set(target, property,value,receiver)
  }
});
*/

var State = observable({

})

//proxioMap.set('State',State);
proxioMap.set(State,'State');
proxioMap.set('Actions',Actions);

function namespace (namespace,action,context) {

//  Actions[namespace] = source;
   //inspect obj add all functions to global functions using namespace
//  return target[namespace] = source
}


module.exports = {
  namespace,
  intercept,

  State,
  Actions
}
