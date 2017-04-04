'use strict'

/*
 var observable = require('../observer/observer').observable
 var interceptMap = require('../observer/observer').interceptMap
 var observer = require('../observer/observer')**/
var observable = require('../observer/observerFinal').observable
var observer = require('../observer/observerFinal')
var queueObservers = require ('../observer/observerFinal').queueObservers
var computedMap = observer.computedMap

var intercept = function(target,method,property,interceptor){
//  interceptMap.set(target,[method,property,interceptor])
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
      var proxyoTEMP = target.prototype.__proxyoTEMP, targetSet
      delete target.prototype.__proxyoTEMP
      var computedResults = {}
      super(args);
      if (proxyoTEMP && proxyoTEMP.computed){
        proxyoTEMP.computed.forEach((item)=>{
          targetSet = computedMap.get(item.key)
          if (!targetSet){
            targetSet = new Set().add(this)
            computedMap.set(item.key,targetSet)

          } else{
            targetSet.add(this)
          }
          delete target.prototype[item.key]
          Object.defineProperty(target.prototype, item.key, {
            enumerable: false,
            configurable: true,
            get: function(){
              if (item.observer.runs === 0){
                item.observer.exec(true)
              }
          //    console.log('returning '+item.key+' returned '+item.computedResult)
              return item.computedResult
            },
            set: function(val){
              if (!item.set){
                throw new Error ('No setter was defined for '+item.key + ' calculated property')
              }

              item.set.call(this,val)
            }
          });
        })
      }
      var thisObs = observable(this);
      function computedWraper(item){

        if (item.type === 'getter'){
          //   console.log('computing...')
             item.computedResult = item.get.call(this)
          //   console.log('computing done!')
        }
        if (item.type === 'function'){
          item.computedResult = item.value.call(this)
        }
        if (item.observer.runs > 0){
            queueObservers(this.$raw,item.key,true)
        }

      }
      if (proxyoTEMP && proxyoTEMP.computed){
        proxyoTEMP.computed.forEach((item)=>{
          item.computedResult = undefined;
          item.observer = observer.createObserver({type:'autorun',metaData:'computed',fn:computedWraper,context:thisObs,args:[item],dontRun:true})
          //item.observer.exec(true)
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

  var tmp = {
    type: typeof descriptor.value === 'function' ? 'function' : 'getter',
    key:key,
    get:descriptor.get,
    set:descriptor.set,
    value:descriptor.value
  }
  proxyoTEMP.computed.push(tmp)

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
  action
}

