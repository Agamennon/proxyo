/*var observable = require('../observer/observer').observable
 var interceptMap = require('../observer/observer').interceptMap
 var observer = require('../observer/observer')*/
var observable = require('../observer/observerLight').observable
var observer = require('../observer/observerLight')

var computedMap = {};

var intercept = function(target,method,property,interceptor){
  interceptMap.set(target,[method,property,interceptor])
}

function action (...params){

  var originalFn
  var fn = function(...args){
    var context = observer.proxies.get(this)
    originalFn.apply(context||this,arguments)
  }

  var wraper = function (target,key,descriptor) {
    originalFn = descriptor.value
    descriptor.value = fn
  }
  //determinar o estilo usado @anotation ou function() se userFn existe eh function senao vai ser uma anotation
  var userFn = (typeof params[0] === 'function') ? params[0] : null
  if (!userFn){
    userFn = ((typeof params[0] === 'string') && (typeof params[1] === 'function')) ? params[1] : null
  }
  if (userFn) {    //fazer o certo para functions()
    originalFn = userFn
    return fn;
  }
  else { //fazer o certo para actions
    return (typeof params[0] === 'object') ? wraper(...params) : wraper
  }

}


function toObservable(target){

  return class extends target {
    constructor(...args) {
      var proxyoTEMP = target.prototype.__proxyoTEMP
      delete target.prototype.__proxyoTEMP
      var computedResults = {}
      if (proxyoTEMP && proxyoTEMP.computed){
        proxyoTEMP.computed.forEach((item)=>{
          Object.defineProperty(target.prototype, item.key, {
            enumerable: false,
            configurable: true,
            get: function(){
              return computedResults[item.key]
            }
          });
        })
      }
      super();

      var thisObs = observable(this);
      function computedWraper(item){
        computedResults[item.key] = item.get.call(this)
      }
      if (proxyoTEMP && proxyoTEMP.computed){
        proxyoTEMP.computed.forEach((item)=>{
          observer.observe(computedWraper,thisObs,item)
        })
      }
    }
  }



}

function computed (target, key , descriptor) {
  var proxyoTEMP = target.constructor.prototype.__proxyoTEMP
  if (!proxyoTEMP){
    proxyoTEMP = target.constructor.prototype.__proxyoTEMP = {
      computed:[]
    }
  }
  proxyoTEMP.computed.push({
    key:key,
    get:descriptor.get,
    set:descriptor.set
  })
}

var state = observable({})
var replaceState = (userState)=> {
  Object.keys(state).map((key)=>{
    delete state[key]
  })
  Object.assign(state,userState)
  return state
}



module.exports = {
  intercept,
  computed,
  replaceState,
  toObservable,
  state,
  computedMap,
  action
}
