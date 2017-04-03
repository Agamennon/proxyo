'use strict'

/*
 var observable = require('../observer/observer').observable
 var interceptMap = require('../observer/observer').interceptMap
 var observer = require('../observer/observer')**/
var observable = require('../observer/observerLight').observable
var observer = require('../observer/observerLight')
var queueObservers = require ('../observer/observerLight').queueObservers
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
      var proxyoTEMP = target.prototype.__proxyoTEMP
      delete target.prototype.__proxyoTEMP
      super(args);
      var computedResults = {}


      if (proxyoTEMP && proxyoTEMP.computed){
        proxyoTEMP.computed.forEach((item)=>{
          var targetSet = computedMap.get(item.key)
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
              return item.computedResult
              //return computedResults[item.key].result
            },
            set: function(val){

          //    console.log('wtf')
             // item.observer.metaData = 'discard'
              item.set.call(this,val)
             // setting = false
           //   item.set('huma turman')
            }
          });
        })
      }

      var thisObs = observable(this);

      function computedWraper(item){
        console.log('computing ->',item.key)

        if (item.type === 'getter'){
           //Promise.resolve().then(()=>{
             item.computedResult = item.get.call(this)
          //})
        }
        if (item.type === 'function'){
          item.computedResult = item.value.call(this)
        }
        if (item.observer.runs > 0){
            queueObservers(this.$raw,item.key,true)
        }

    //   Promise.resolve().then(()=>{queueObserver(this.$raw,item.key)})
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

