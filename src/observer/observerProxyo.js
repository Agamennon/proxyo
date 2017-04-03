
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
let currentObservers = []

const handlers = {get, set, ownKeys, deleteProperty}

module.exports = {
  proxies,
  observe,
  reaction,
  observable,
  isObservable,
  createObserver,
  queueObserver,
}

function none (){

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


  /*if (typeof context === 'object'){
   toObservable(context)
   }*/
  //none('DONT RUN?',dontRun)
  if (dontRun){
    return observer
  }
  runObserver(observer,true)
//  runObserver(observer)
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
    //none(builtIn)
    observable = builtIn(obj, registerObserver, queueObserver)
  } else if (!builtIn) {
    observable = new Proxy(obj, handlers)
  } else {
    observable = obj
  }
  proxies.set(obj, observable)
  proxies.set(observable, observable)
  observers.set(obj, new Map())
  return observable



  /*  let observable
   observable = new Proxy(obj, handlers)
   proxies.set(obj, observable)
   proxies.set(observable, observable)
   observers.set(obj, new Map())
   return observable*/
}

function isObservable (obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('first argument must be an object')
  }
  return (proxies.get(obj) === obj)
}



function get (target, key, receiver) {
  none('GETTING ',key,target)
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
  /* if (key === '@@toStringTag'){
   return result
   }*/

  /* if(!proxies.get(target)){
   none('sadfllksdjflksdfjlsdkfjsldkfjlsdkfjsldkfjsdlkfjsdlkfjsdlkfsldjkfd')
   toObservable(target)
   }*/



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



function registerObserver (target, key) {

  if (currentObserver) {
    var ooo = 'the view'
    if (currentObserver.args){
      ooo = currentObserver.args[0].key
    }
    none("registring observer ", key, ooo)
    const observersForTarget = observers.get(target)
    let observersForKey = observersForTarget.get(key)


    if (!observersForKey) {
      observersForKey = new Set()
      observersForTarget.set(key, observersForKey)
      if (!observersForKey.has(currentObserver)) {
        observersForKey.add(currentObserver)
        currentObserver.observedKeys.push(observersForKey)
      }
    }
    //  if (key === 'fullName'){

    //  }
  }
}



function set (target, key, value, receiver) {

  none('triggering SET')
  if (key === 'length' || value !== Reflect.get(target, key, receiver)) { //lenght to observe changes in arrays
    // if (key === 'length' || true) { //lenght to observe changes in arrays

//  if (value !== Reflect.get(target, key, receiver)) {

    queueObserver(target, key)
    queueObserver(target, enumerate)
  }
  if (typeof value === 'object' && value) {
    value = value.$raw || value
  }
  return Reflect.set(target, key, value, receiver)

}


function queueObserver (target,key,runNow) {
  if (runNow){
    const observersForKey = observers.get(target).get(key)
    if (observersForKey) {
      observersForKey.forEach((observer)=>{
        none('running NOW')
        runObserver(observer)
      })
    }
    return
  }

  none('QueueObserver',target,key,queued)
  const observersForKey = observers.get(target).get(key)
  if (observersForKey) {
    observersForKey.forEach((observer)=>{
      none('adding observer to QUEUE')
      queuedObservers.add(observer)
    })
  }

  if (!queued) {
    nextTick(runObservers)
    queued = true
  }
}

function runObservers () {
  // console.log('runobservers ',queuedObservers)
  var computedObservers = new Set()
  var otherObservers = new Set()
  queuedObservers.forEach((observer)=>{

    if (observer.metaData === 'computed'){

      computedObservers.add(observer);
    } else {
      otherObservers.add(observer);
    }
  })

  Array.from(computedObservers.values()).forEach((observer)=>{
    runObserver(observer)
  })

  Array.from(otherObservers.values()).forEach((observer)=>{
    runObserver(observer)
  })
  none('clrearing observers queue')
  queuedObservers.clear()
  queued = false
}


function runObserver (observer,firstRun) {
  console.log('firstRun',firstRun)
  var whatobs = observer.args ? observer.args[0].key : 'view'
  none('running observer for ',whatobs)
  if (currentObserver){
    none('unshifiting observer')
    currentObservers.unshift(currentObserver)
  }
  currentObserver = observer


  try {

    switch (observer.type){
      case 'autorun':
        observer.fn.apply(observer.context, observer.args)
        none('done ->',whatobs)
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
    none('poping observer')
    currentObserver = currentObservers.pop()
    //currentObserver = undefined
  }
}




function ownKeys (target) {  //uses in for in loops and  enumerate is just a simbol to tag enumeration

  registerObserver(target, enumerate)

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

function exec (firstRun) {
  runObserver(this,firstRun)
}



/*




 'use strict'

 const nextTick = require('./nextTick')
 const builtIns = require('./builtIns/index')
 const wellKnowSymbols = require('./wellKnownSymbols')

 const proxies = new WeakMap()
 const observers = new WeakMap()
 const queuedObservers = new Set()
 const enumerate = Symbol('enumerate')


 let queued = false
 let currentObservers = []

 const handlers = {get, set, ownKeys, deleteProperty}

 module.exports = {
 proxies,
 observe,
 reaction,
 observable,
 isObservable,
 createObserver,
 queueObserver,
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


 /!*if (typeof context === 'object'){
 toObservable(context)
 }*!/
 none('DONT RUN?',dontRun)
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
 //none(builtIn)
 observable = builtIn(obj, registerObserver, queueObserver)
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
 none('GETTING ',key,target)


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
 /!* if (key === '@@toStringTag'){
 return result
 }*!/

 /!* if(!proxies.get(target)){
 none('sadfllksdjflksdfjlsdkfjsldkfjlsdkfjsldkfjsdlkfjsdlkfjsdlkfsldjkfd')
 toObservable(target)
 }*!/



 const isObject = (typeof result === 'object' && result) //typeof object its object (arrays are condierd objects too) or null por isso check result
 let observable = isObject && proxies.get(result)

 if (!observable && isObject){
 observable =  toObservable(result)
 }

 if (currentObservers.length > 0) {

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

 if (currentObservers.length > 0) {
 const observersForTarget = observers.get(target)
 let observersForKey = observersForTarget.get(key)

 currentObservers.forEach((currentObserver)=>{
 if (!observersForKey) {
 observersForKey = new Set()
 observersForTarget.set(key, observersForKey)
 }


 if (!observersForKey.has(currentObserver)) {
 observersForKey.add(currentObserver)
 // none('observersForKey',observersForKey)
 currentObserver.observedKeys.push(observersForKey)
 }
 })
 }

 }


 function queueObserver (target,key) {
 none('QueueObserver',target,key)
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
 //reorder queuedobservers
 var computedObservers = new Set()
 var otherObservers = new Set()
 queuedObservers.forEach((observer)=>{

 if (observer.metaData === 'computed'){

 computedObservers.add(observer);
 } else {
 otherObservers.add(observer);
 }
 })

 Array.from(computedObservers.values()).forEach((observer)=>{
 runObserver(observer)
 })

 Array.from(otherObservers.values()).forEach((observer)=>{
 runObserver(observer)
 })

 /!*  queuedObservers.forEach((observer)=>{
 runObserver(observer)
 })*!/

 queuedObservers.clear()
 queued = false
 }

 function runObserver (observer,firstRun) {
 try {
 // if (firstRun){


 currentObservers.unshift(observer)

 none('running observer',observer,firstRun)

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
 //  if (firstRun){
 none('current observer (shift) ---->',currentObservers)
 currentObservers.shift()
 //  }

 }
 }

 function ownKeys (target) {  //uses in for in loops and  enumerate is just a simbol to tag enumeration

 registerObserver(target, enumerate)

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

 function exec (firstRun) {
 runObserver(this,firstRun)
 }


 */
