'use strict'

const nextTick = require('./nextTick')
const builtIns = require('./builtIns')
const wellKnowSymbols = require('./wellKnownSymbols')

const proxies = new WeakMap()
const observers = new WeakMap()
const queuedObservers = new Set()
const queuedObserversComputed = new Set()
var currentObservers = []
const enumerate = Symbol('enumerate')
let queued = false
let currentObserver
const handlers = {get, ownKeys, set, deleteProperty}

module.exports = {
  proxies,
  observe,
  observable,
  isObservable,
  createObserver,
  queueObservers
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
  const {type,fn,context,cb,cbContext,args,dontRun,metaData} = options
  const observer = {type,fn,context,args,cb,cbContext,metaData,observedKeys: [],runs:0, unobserve,exec,unqueue}
  if (dontRun){
    return observer
  }
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
  const builtIn = builtIns.get(obj.constructor)
  if (typeof builtIn === 'function') {
    observable = builtIn(obj, registerObserver, queueObservers)
  } else if (!builtIn) {
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











function get (target, key, receiver) {
  if (key === '$raw') return target
  const result = Reflect.get(target, key, receiver)
  if (typeof key === 'symbol' && wellKnowSymbols.has(key)) {
    return result
  }
  const isObject = (typeof result === 'object' && result)
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


function set (target, key, value, receiver) {

  if (key === 'length' || value !== Reflect.get(target, key, receiver)) {

    queueObservers(target, key)
    queueObservers(target, enumerate)
  }
  if (typeof value === 'object' && value) {
    value = value.$raw || value
  }
  return Reflect.set(target, key, value, receiver)
}

function queueObservers (target, key,runNow) {
/*  if (runNow){
    const observersForKey = observers.get(target).get(key)
    if (observersForKey) {
      observersForKey.forEach((observer)=>{
        console.log('running now observer', observer);
        runObserver(observer)
      })
    }
    return
  }*/
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

  // queuedObservers.add(observer)
  if (observer.metaData === 'computed'){
    queuedObserversComputed.add(observer)
  } else {
    queuedObservers.add(observer)
  }

}

function runObservers () {
 //Array.from(queuedObservers.entries())[0].forEach((obs)=>{
  queuedObserversComputed.forEach((observer)=>{
    console.log('running observer computed', observer);
    runObserver(observer)
  })
  queuedObservers.forEach((observer)=>{
   // tmp2.unshift(observer)
    //console.log(observer)
    console.log('running observer regular', observer);
    runObserver(observer)
  })



  queuedObserversComputed.clear()
  queuedObservers.clear()
  queued = false
}



function runObserver (observer,firstRun) {

  //console.log('Running Observer ',observer)
  if (currentObserver){
    currentObservers.unshift(currentObserver)
  }
   currentObserver = observer
  //console.log('running',observer)
  try {
    switch (observer.type){
      case 'autorun':
        observer.fn.apply(observer.context, observer.args)
        observer.runs ++
        break
      case 'reaction':
        if (firstRun){
          observer.fn.apply(observer.context, observer.args)
          observer.runs ++
        } else {
          observer.cb.apply(observer.cbContext, observer.args)
          observer.runs ++
        }
        break
    }
  } finally {
    currentObserver = currentObservers.pop()
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

function unobserveKey (observersForKey) {
  observersForKey.delete(this)
}