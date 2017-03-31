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

const handlers = {get, set, ownKeys, deleteProperty}

module.exports = {
  proxies,
  observe,
  reaction,
  observable,
  isObservable,
}

function reaction (fn,context,cb,cbContext,...args) {
  const options = {
    type:'reaction',
    fn:fn,
    context:context,
    cb,
    cbContext,
    args:args.length ? args: undefined
  }
  return createObserver(options)
}


function observe (fn, context, ...args) {
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function')
  }
  const options = {
    type:'autorun',
    fn:fn,
    context:context,
    args:args.length ? args: undefined
  }
  return createObserver(options)
}

function createObserver(options){


  const {type,fn,context,cb,cbContext,args} = options
  const observer = {type,fn,context,args,cb,cbContext, observedKeys: [], unobserve,exec,unqueue}


  /*if (typeof context === 'object'){
    toObservable(context)
  }*/
  runObserver(observer,true)
  return observer
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
  observable = new Proxy(obj, handlers)
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



function get (target, key, receiver) {
//  console.log('TARGET --------------------------------->',target)
  if (key === '$raw') return target


    if (key === 'toJSON') {
      return function(){
        return target
      }
    }


  var result = Reflect.get(target, key, receiver)

  if (typeof key === 'symbol' && wellKnowSymbols.has(key)) {   //NOT OBSERVE WELL KNOWN SIMBOLS
    return result
  }
  if (key === '@@toStringTag'){
    return result
  }

/*
     if(!proxies.get(target)){
       console.log('sadfllksdjflksdfjlsdkfjsldkfjlsdkfjsldkfjsdlkfjsdlkfjsdlkfsldjkfd')
       toObservable(target)
     }
*/



  const isObject = (typeof result === 'object' && result) //typeof object its object (arrays are condierd objects too) or null por isso check result
  let observable = isObject && proxies.get(result)

  if (!observable && isObject){
    observable =  toObservable(result)
  }

  if (currentObserver) {

    registerObserver(target, key)
    if (isObject) {
      return observable || toObservable(result)
    }
  }


  return observable || result
}


function set (target, key, value, receiver) {


  if (key === 'length' || value !== Reflect.get(target, key, receiver)) { //lenght to observe changes in arrays

//  if (value !== Reflect.get(target, key, receiver)) {

    queueObserver(target, key)
    queueObserver(target, enumerate)
  }
  if (typeof value === 'object' && value) {
    value = value.$raw || value
  }
  return Reflect.set(target, key, value, receiver)

}

function registerObserver (target, key) {

  const observersForTarget = observers.get(target)  //volta um mapa que contem as chaves desse objeto
  let observersForKey = observersForTarget.get(key)  //volta um set que contem os pares
  if (!observersForKey) {
    observersForKey = new Set()
    observersForTarget.set(key, observersForKey)
  }
  if (!observersForKey.has(currentObserver)) {
    observersForKey.add(currentObserver)
    currentObserver.observedKeys.push(observersForKey)
  }

 // currentObserver.observedKeys.push(observersForKey)
  //observersForKey.add(currentObserver)
}


function queueObserver (target,key) {
  const observersForKey = observers.get(target).get(key)
  if (observersForKey) {
    observersForKey.forEach((observer)=>{
      queuedObservers.add(observer)
    })
  }
  if (!queued) {
     nextTick(runObservers)
     queued = true
  }
}

function runObservers () {
  queuedObservers.forEach((observer)=>{
    runObserver(observer)
  })
  queuedObservers.clear()
  queued = false
}

function runObserver (observer,firstRun) {
  try {
  // if (firstRun){
      currentObserver = observer
   // }
    switch (observer.type){
      case 'autorun':observer.fn.apply(observer.context, observer.args)
        break
      case 'reaction':
        if (firstRun){
          observer.fn.apply(observer.context, observer.args)
        } else {
          observer.cb.apply(observer.cbContext, observer.args)
        }
         break
    }
  } finally {
  //  if (firstRun){
      currentObserver = undefined
  //  }
  }
}

function ownKeys (target) {  //uses in for in loops and  enumerate is just a simbol to tag enumeration
  if (currentObserver) {
    registerObserver(target, enumerate)
  }
  return Reflect.ownKeys(target)
}


function unobserveKey (observersForKey) {
  observersForKey.delete(this)
}

function unqueue () {
  queuedObservers.delete(this)
}

function deleteProperty (target, key) {
  if (Reflect.has(target, key)) {
    queueObserver(target, key)
    queueObserver(target, enumerate)
  }
  return Reflect.deleteProperty(target, key)
}

function unobserve () {
  if (this.fn) {
    this.observedKeys.forEach(unobserveKey, this)
    this.fn = this.context = this.args = this.observedKeys = undefined
    queuedObservers.delete(this)
  }
}

function exec () {
  runObserver(this)
}

