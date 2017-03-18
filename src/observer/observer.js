'use strict'

const nextTick = require('./nextTick')
const builtIns = require('./builtIns/index')
const wellKnowSymbols = require('./wellKnownSymbols')

const proxies = new WeakMap()
const observers = new WeakMap()
const queuedObservers = new Set()

const enumerate = Symbol('enumerate')
let queued = false
let currentObserver
const handlers = {get, ownKeys, set, deleteProperty}

//gui
var interceptMap = new Map()
//end gui

module.exports = {
  observe,
  observable,
  isObservable,
  interceptMap
}

function observe (fn, context, ...args) {
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function')
  }
  args = args.length ? args : undefined
  const observer = {fn, context, args, observedKeys: [], exec, unobserve, unqueue}
  runObserver(observer)
  return observer
}

function exec () {
  runObserver(this)
}

function unobserve () {
  if (this.fn) {
    this.observedKeys.forEach(unobserveKey, this)
    this.fn = this.context = this.args = this.observedKeys = undefined
    queuedObservers.delete(this)
  }
}

function unqueue () {
  queuedObservers.delete(this)
}

function observable (obj) {
  obj = obj || {}
  if (typeof obj !== 'object') {
    throw new TypeError('first argument must be an object or undefined')
  }
  return proxies.get(obj) || toObservable(obj)

}

function toObservable (obj) {
  let observable

  const builtIn = builtIns.get(obj.constructor)//builtIns eh um mapa (get pega o valor com a chave obj.constructor)

  //se o que for passado foi contruido com um contrutor do tipo function, como Map Set do proprio motor
  if (typeof builtIn === 'function') {
    observable = builtIn(obj, registerObserver, queueObservers)
  } else if (!builtIn) { //quando builtin eh diferente de function e contem valor????
    observable = new Proxy(obj, handlers)
  } else {
    observable = obj
  }
  proxies.set(obj, observable)
  proxies.set(observable, observable)
  observers.set(obj, new Map())
  return observable
}

function isObservable (obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('first argument must be an object')
  }
  return (proxies.get(obj) === obj)
}










/*

function intercept(method, receiver ,key){
  var interceptData = interceptMap.get(receiver);
  var interceptResult;
  if (interceptData){
    if ((interceptData[0] === method) && (interceptData[1] === key || interceptData[1] === '')){
      interceptResult = interceptData[2].apply(receiver,arguments)
    }
  }
  return interceptResult
}
*/




function get (target, key, receiver) {
  if (key === '$raw') return target

//INTERCEPT
  var interceptData = interceptMap.get(receiver);
  var interceptResult;
  if (interceptData) {
    if ((interceptData[0] === 'get') && (interceptData[1] === key || interceptData[1] === '')) {
      interceptResult = interceptData[2].apply(receiver, arguments)
    }
  }

  let result

  if (interceptResult){
    result = interceptResult;
  }  else{
    result = Reflect.get(target, key, receiver)
  }
//END INTERCEPT

  if (typeof key === 'symbol' && wellKnowSymbols.has(key)) {
    return result
  }
  const isObject = (typeof result === 'object' && result) //typeof object its object (arrays are condierd objects too) or null por isso check result

 let observable = isObject && proxies.get(result)

  //another gui devolve observers sempre
  if (!observable && isObject){
    observable =  toObservable(result)
  }
 //

  if (currentObserver) {
    registerObserver(target, key)
    if (isObject) {
      return observable || toObservable(result)
    }
  }

  //gui additions  captura metodos e da autobind apply neles
  if (typeof result == 'function' && result.name !== 'valueOf' && result.name !== 'toString' && result.name !== 'Object'){
    var origMethod = target[key];
    return function(...args){
      const res = origMethod.apply(receiver,args);
      return res
    }
  }
//end gui
  return observable || result

}


function set (target, key, value, receiver) {

  //console.log('triggering Set at key',key)
//  console.log('triggering Set at key',key)

  var interceptData = interceptMap.get(receiver);
  var interceptResult;
  if (interceptData){
    if ((interceptData[0] === 'set') && (interceptData[1] === key || interceptData[1] === '')){
      interceptResult = interceptData[2].apply(receiver,arguments)
    }
  }


    //value = interceptResult
    //console.log('interceptResult',interceptResult)
    //value = interceptResult
    if (key === 'length' || value !== Reflect.get(target, key, receiver)) {
      queueObservers(target, key)
      queueObservers(target, enumerate)
    }
    if (typeof value === 'object' && value) {
      value = value.$raw || value
    }
    //return Reflect.set(target, key, value, receiver)
    //mudanca grava tudo como observer
   // return target[key] = value
   // return Reflect.set(target, key, (typeof value === 'object' && value) ? toObservable(value): value, receiver)
    return Reflect.set(target, key, value, receiver)



}















function registerObserver (target, key) {
  if (currentObserver) {
    const observersForTarget = observers.get(target)
    let observersForKey = observersForTarget.get(key)
    if (!observersForKey) {
      observersForKey = new Set()
      observersForTarget.set(key, observersForKey)
    }
    if (!observersForKey.has(currentObserver)) {
      observersForKey.add(currentObserver)
      currentObserver.observedKeys.push(observersForKey)
    }
  }
}

function ownKeys (target) {
  registerObserver(target, enumerate)
  return Reflect.ownKeys(target)
}


function deleteProperty (target, key) {
  if (Reflect.has(target, key)) {
    queueObservers(target, key)
    queueObservers(target, enumerate)
  }
  return Reflect.deleteProperty(target, key)
}

function queueObservers (target, key) {
  const observersForKey = observers.get(target).get(key)
  if (observersForKey && observersForKey.constructor === Set) {
    observersForKey.forEach(queueObserver)
  } else if (observersForKey) {
    queueObserver(observersForKey)
  }
}

function queueObserver (observer) {
  if (!queued) {
    nextTick(runObservers)
    queued = true
  }
  queuedObservers.add(observer)
}

function runObservers () {
  queuedObservers.forEach(runObserver)
  queuedObservers.clear()
  queued = false
}

function runObserver (observer) {
  try {
    currentObserver = observer
    observer.fn.apply(observer.context, observer.args)
  } finally {
    currentObserver = undefined
  }
}

function unobserveKey (observersForKey) {
  observersForKey.delete(this)
}

