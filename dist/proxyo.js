(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["proxyo"] = factory(require("react"));
	else
		root["proxyo"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const nextTick = __webpack_require__(10)
const builtIns = __webpack_require__(9)
const wellKnowSymbols = __webpack_require__(11)

const proxies = new WeakMap()
const observers = new WeakMap()
const queuedObservers = new Set()
const imediateObservers = new Set()
const enumerate = Symbol('enumerate')


let queued = false
let currentObserver

const handlers = {get, set, ownKeys, deleteProperty}

module.exports = {
  proxies,
  observe,
  observable,
  isObservable,
}


function observe (fn, context, ...args) {

  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function')
  }
 // console.log('-------------------------------------------------------IMEDIATE',imediate)
  args = args.length ? args : undefined
  const observer = {fn, context, args, observedKeys: [],unobserve}
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
 /* let observable
  const builtIn = builtIns.get(obj.constructor)//builtIns eh um mapa (get pega o valor com a chave obj.constructor)
  if (typeof builtIn === 'function') {
    console.log('BINGO BINGO BINGO')
    observable = builtIn(obj, registerObserver, queueObserver)
  } else if (!builtIn) { //quando builtin eh diferente de function e contem valor????
    observable = new Proxy(obj, handlers)
  } else {
    observable = obj
  }
  proxies.set(obj, observable)
  proxies.set(observable, observable)
  observers.set(obj, new Map())
  return observable*/

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
  if (key === '$raw') return target

  var result = Reflect.get(target, key, receiver)
  console.log('getting', key, target)

  if (typeof key === 'symbol' && wellKnowSymbols.has(key)) {   //NOT OBSERVE WELL KNOWN SIMBOLS
    return result
  }

  const isObject = (typeof result === 'object' && result) //typeof object its object (arrays are condierd objects too) or null por isso check result
  let observable = isObject && proxies.get(result)

  if (!observable && isObject){
    observable =  toObservable(result)
  }

  if (currentObserver) {
  //  console.log('currentObserver set')
    registerObserver(target, key)
    if (isObject) {
      return observable || toObservable(result)
    }
  }


  return observable || result
}


function set (target, key, value, receiver) {

  console.log('setting' ,key, target , value)
  if (key === 'length' || value !== Reflect.get(target, key, receiver)) { //lenght to observe changes in arrays

//  if (value !== Reflect.get(target, key, receiver)) {
    console.log('setting introspect',key,value,target)
    queueObserver(target, key)
    queueObserver(target, enumerate)
  }
  if (typeof value === 'object' && value) {
    value = value.$raw || value
  }
  return Reflect.set(target, key, value, receiver)

}

function registerObserver (target, key) {
  console.log('regestring',key,target)
  const observersForTarget = observers.get(target)  //volta um mapa que contem as chaves desse objeto
  let observersForKey = observersForTarget.get(key)  //volta um set que contem os pares
  if (!observersForKey) {
    observersForKey = new Set()
    observersForTarget.set(key, observersForKey)
    console.log('seting new observer for target ',key,observersForKey)
  }
  if (!observersForKey.has(currentObserver)) {
    observersForKey.add(currentObserver)
    currentObserver.observedKeys.push(observersForKey)
  }

 // currentObserver.observedKeys.push(observersForKey)
  //observersForKey.add(currentObserver)
}


function queueObserver (target,key) {
  console.log('queueObserver for',key,target)
  const observersForKey = observers.get(target).get(key)
  if (observersForKey) {
 //   console.log('observer for key found!',key)
    observersForKey.forEach((observer)=>{
      //imediateObservers.add()
    //  if (!observer.imediate){
        queuedObservers.add(observer)
  //    } else {
     //   console.log('running imediate')
       // imediateObservers.add(observer)
    //    runObserver(observer)
  //    }


    })
  }


  if (!queued) {

     nextTick(runObservers)
     queued = true
  }
}

function runObservers () {
  queuedObservers.forEach(runObserver)
  queuedObservers.clear()
  queued = false
}

function runObserver (observer,firstRun) {
  console.log('runObserver',observer)
  try {
  // if (firstRun){
      currentObserver = observer
   // }
     observer.fn.apply(observer.context, observer.args)
  } finally {
  //  if (firstRun){
      currentObserver = undefined
  //  }


  }

}

function ownKeys (target) {  //uses in for in loops and  enumerate is just a simbol to tag enumeration
  if (currentObserver) {
    console.log ('-------------- target ownKeys', target)
    registerObserver(target, enumerate)
  } else {
    console.log (' ELSE------------------ target ownKeys', target)
  }
  return Reflect.ownKeys(target)
}


function unobserveKey (observersForKey) {
  observersForKey.delete(this)
}

function unobserve () {
  if (this.fn) {
    this.observedKeys.forEach(unobserveKey, this)
    this.fn = this.context = this.args = this.observedKeys = undefined
    queuedObservers.delete(this)
  }
}

function deleteProperty (target, key) {
  if (Reflect.has(target, key)) {
    queueObserver(target, key)
    queueObserver(target, enumerate)
  }
  return Reflect.deleteProperty(target, key)
}




/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {



var React = __webpack_require__ (1)
//var observer = require('../observer/observer')
var observer = __webpack_require__(0)
var isObjectShallowModified = __webpack_require__ (13);
var toClass = __webpack_require__ (14);
var hoistStatics = __webpack_require__(12);



var connect = (...params) => {
//https://github.com/mobxjs/mobx-react/blob/master/src/inject.js
  //Comp = toClass(Comp);

  if (typeof params[0] === 'function'){
    //console.log ('sem opcoes vamos colocar tudo em um objeto store ou vamos colocar tudo em props?')
    var mode = 'noOptions'
  } else{

    if (!Array.isArray(params[0])){
       throw new Error("Store options must be an array");
    }
    var mode = 'withOptions'
    var options = params[0]
  }


  var factory = function (Comp){
    Comp = toClass(Comp);

    class Enhancer extends Comp {

      /* static contextTypes = {
       proxyoStores: React.PropTypes.object
       };*/

      constructor(props,context){

        //console.log('constructor');
        super(...arguments);

        this.obs = {};
        if (context.proxyoStores){
          this.obs = context.proxyoStores
        }




        //  console.log(context);
        this._fn = this._fn.bind(this);
        this._signal = null;
        this._mounted = false;
        this._renderResult = null;

      }

      _fn (){
        this._renderResult = super.render()
        if (this._mounted){
          console.log('change detected on '+getDisplayName(Comp))
          this.forceUpdate()
        }
      }

      componentDidMount() {
        // console.log('did mount')
        this._mounted = true;
        if (super.componentWillUnmount){
          super.componentWillUnmount()
        }
      }

      shouldComponentUpdate(nextProps,nextState) {
        //return false
       // delete this.props.store
        //  console.log(this.props)
        //  console.log(nextProps)
        //  console.log(isObjectShallowModified(this.props, nextProps));
        if (this.state !== nextState) {
          return true;
        }
        return isObjectShallowModified(this.props, nextProps);

      }

      componentWillUnmount() {
        //   console.log('willunmount')
        if (super.componentWillUnmount){
          super.componentWillUnmount()
        }
        this._mounted = false
        if (this._signal) {
          this._signal.unobserve();
          //  console.log("signal released")
        }
      }
      render() {


        console.log('rendering HOC for -> '+getDisplayName(Comp))



        //this.props =  Object.assign({}, this.props, {store:obs})
        switch(mode) {
          case 'noOptions':
            this.props = Object.assign({}, this.obs, this.props)
            break
          case 'withOptions':
            var selection = {}
            var tt = options.map((value) => {
              if (value in this.obs) {
                selection[value] = this.obs[value]
              }
            })
            console.log('selection',selection);
            this.props = Object.assign({}, selection, this.props)
            break
        }




//     console.log('render called ->', Comp.name)
        if (!this._mounted){
          this._signal = observer.observe(this._fn,this);
        }
        return this._renderResult
      }
    };

    function getDisplayName (Comp) {
      return Comp.displayName ||
          Comp.name || `Component`
    }

    Enhancer.displayName = `HOCProxyo(${getDisplayName(Comp)})`

    Enhancer.contextTypes = {
      proxyoStores: React.PropTypes.object
    };

    hoistStatics(Enhancer,Comp)

    return Enhancer
  }


  if (typeof params[0] === 'function'){
    return factory(params[0])
  }
  return factory
  /*if (params.length === 0){
    //factory
    console.log('no params?')
    console.log(arguments)
    return factory(arguments[5])
  } else {
    return factory
  }

*/

}



module.exports = connect
//export default connect2





/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


var React = __webpack_require__(1)

const specialReactKeys = {children: true, key: true, ref: true};



class Provider extends React.Component {

/*  static contextTypes = {proxyoStores: React.PropTypes.object};

  static childContextTypes = {proxyoStores: React.PropTypes.object.isRequired};*/

  render() {
    return React.Children.only(this.props.children);
  }

  getChildContext() {
  //  console.log(this.props);
   // const stores = {};
    // inherit stores
 /*   const baseStores = this.context.proxyoStores;
    if (baseStores)
      for (let key in baseStores) {
        stores[key] = baseStores[key];
      }
    // add own stores
    for (let key in this.props)
      stores[key] = this.props[key];
    console.log(stores);*/
    return {proxyoStores: this.props.proxyoStores};
  }

}

Provider.contextTypes = {proxyoStores: React.PropTypes.object};
Provider.childContextTypes = {proxyoStores: React.PropTypes.object.isRequired};

module.exports = Provider




/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*var observable = require('../observer/observer').observable
 var interceptMap = require('../observer/observer').interceptMap
 var observer = require('../observer/observer')*/
var observable = __webpack_require__(0).observable
var observer = __webpack_require__(0)

var computedResult = new Set();

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


function computed (...params){

  console.log(params)

  var target = params[0]
  var key = params[1]
  var descriptor = params[2]

  var originalGet = descriptor.get
  var result

  var wraper = function () {
    console.log('inside wrapper')
    result = originalGet.apply(this)
    console.log('wrapper result ===============',result)
  }
  var signal = null

  descriptor.get = function(){
    console.log('inside get ')

    if (!signal){
      console.log(this)
      //var ctx = observer.proxies.get(this)
      console.log('NO SIGNAL')
      //wraper.apply(this,arguments)
    //  Promise.resolve().then(()=>{

      signal = observer.observe(wraper,this)
   //   })
     /* setTimeout(()=>{
        signal = observer.observe(wraper,this,arguments)
      },0)*/


      console.log(result)
    }
    console.log('RESSSSSSSSSSSSULT',result)
    return result
  }

  //descriptor.get.bind(target)





  /*var originalFn
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
   }*/

}


/*
 function Action(name,fn){
 return function(...args){
 var context = observer.proxies.get(this)
 return fn.apply(context||this,arguments)
 }
 }
 */

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
  state,
  action
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const native = Map.prototype
const masterKey = Symbol('Map master key')

const getters = ['has', 'get']
const iterators = ['forEach', 'keys', 'values', 'entries', Symbol.iterator]
const all = ['set', 'delete', 'clear'].concat(getters, iterators)

module.exports = function shim (target, registerObserver, queueObservers) {
  target.$raw = {}

  for (let method of all) {
    target.$raw[method] = function () {
      native[method].apply(target, arguments)
    }
  }

  for (let getter of getters) {
    target[getter] = function (key) {
      registerObserver(this, key)
      return native[getter].apply(this, arguments)
    }
  }

  for (let iterator of iterators) {
    target[iterator] = function () {
      registerObserver(this, masterKey)
      return native[iterator].apply(this, arguments)
    }
  }

  target.set = function (key, value) {
    if (this.get(key) !== value) {
      queueObservers(this, key)
      queueObservers(this, masterKey)
    }
    return native.set.apply(this, arguments)
  }

  target.delete = function (key) {
    if (this.has(key)) {
      queueObservers(this, key)
      queueObservers(this, masterKey)
    }
    return native.delete.apply(this, arguments)
  }

  target.clear = function () {
    if (this.size) {
      queueObservers(this, masterKey)
    }
    return native.clear.apply(this, arguments)
  }

  return target
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const native = Set.prototype
const masterValue = Symbol('Set master value')

const getters = ['has']
const iterators = ['forEach', 'keys', 'values', 'entries', Symbol.iterator]
const all = ['add', 'delete', 'clear'].concat(getters, iterators)

module.exports = function shim (target, registerObserver, queueObservers) {
  target.$raw = {}

  for (let method of all) {
    target.$raw[method] = function () {
      native[method].apply(target, arguments)
    }
  }

  for (let getter of getters) {
    target[getter] = function (value) {
      registerObserver(this, value)
      return native[getter].apply(this, arguments)
    }
  }

  for (let iterator of iterators) {
    target[iterator] = function () {
      registerObserver(this, masterValue)
      return native[iterator].apply(this, arguments)
    }
  }

  target.add = function (value) {
    if (!this.has(value)) {
      queueObservers(this, value)
      queueObservers(this, masterValue)
    }
    return native.add.apply(this, arguments)
  }

  target.delete = function (value) {
    if (this.has(value)) {
      queueObservers(this, value)
      queueObservers(this, masterValue)
    }
    return native.delete.apply(this, arguments)
  }

  target.clear = function () {
    if (this.size) {
      queueObservers(this, masterValue)
    }
    return native.clear.apply(this, arguments)
  }

  return target
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const native = WeakMap.prototype

const getters = ['has', 'get']
const all = ['set', 'delete'].concat(getters)

module.exports = function shim (target, registerObserver, queueObservers) {
  target.$raw = {}

  for (let method of all) {
    target.$raw[method] = function () {
      native[method].apply(target, arguments)
    }
  }

  for (let getter of getters) {
    target[getter] = function (key) {
      registerObserver(this, key)
      return native[getter].apply(this, arguments)
    }
  }

  target.set = function (key, value) {
    if (this.get(key) !== value) {
      queueObservers(this, key)
    }
    return native.set.apply(this, arguments)
  }

  target.delete = function (key) {
    if (this.has(key)) {
      queueObservers(this, key)
    }
    return native.delete.apply(this, arguments)
  }

  return target
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const native = WeakSet.prototype

const getters = ['has']
const all = ['add', 'delete'].concat(getters)

module.exports = function shim (target, registerObserver, queueObservers) {
  target.$raw = {}

  for (let method of all) {
    target.$raw[method] = function () {
      native[method].apply(target, arguments)
    }
  }

  for (let getter of getters) {
    target[getter] = function (value) {
      registerObserver(this, value)
      return native[getter].apply(this, arguments)
    }
  }

  target.add = function (value) {
    if (!this.has(value)) {
      queueObservers(this, value)
    }
    return native.add.apply(this, arguments)
  }

  target.delete = function (value) {
    if (this.has(value)) {
      queueObservers(this, value)
    }
    return native.delete.apply(this, arguments)
  }

  return target
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const MapShim = __webpack_require__(5)
const SetShim = __webpack_require__(6)
const WeakMapShim = __webpack_require__(7)
const WeakSetShim = __webpack_require__(8)


module.exports = new Map([
  [Map, MapShim],
  [Set, SetShim],
  [WeakMap, WeakMapShim],
  [WeakSet, WeakSetShim],
  [Date, true],
  [RegExp, true]
])


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
let promise = Promise.resolve()
let mutateWithTask
let currTask

module.exports = function nextTick (task) {
  currTask = task
  if (mutateWithTask) {
    mutateWithTask()
  } else {
    promise = promise.then(task)
  }
}

if (typeof MutationObserver !== 'undefined') {
  let counter = 0
  const observer = new MutationObserver(onTask)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {characterData: true})

  mutateWithTask = function mutateWithTask () {
    counter = (counter + 1) % 2
    textNode.textContent = counter
  }
}

function onTask () {
  if (currTask) {
    currTask()
  }
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const wellKnowSymbols = new Set()

for (let key of Object.getOwnPropertyNames(Symbol)) {
  const value = Symbol[key]
  if (typeof value === 'symbol') {
    wellKnowSymbols.add(value)
  }
}

module.exports = wellKnowSymbols


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  mixins: true,
  propTypes: true,
  type: true
};

var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  arguments: true,
  arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
  if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
    var keys = Object.getOwnPropertyNames(sourceComponent);

    /* istanbul ignore else */
    if (isGetOwnPropertySymbolsAvailable) {
      keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
    }

    for (var i = 0; i < keys.length; ++i) {
      if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
        try {
          targetComponent[keys[i]] = sourceComponent[keys[i]];
        } catch (error) {

        }
      }
    }
  }

  return targetComponent;
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function isObjectShallowModified(prev, next) {
  if (null == prev || null == next || typeof prev !== "object" || typeof next !== "object") {
    return prev !== next;
  }
  const keys = Object.keys(prev);
  if (keys.length !== Object.keys(next).length) {
    return true;
  }
  let key;
  for (let i = keys.length - 1; i >= 0, key = keys[i]; i--) {
    if (next[key] !== prev[key]) {
      return true;
    }
  }
  return false;
}
module.exports = isObjectShallowModified

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(1)

const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

const isClassComponent = Component => Boolean(
    Component &&
    Component.prototype &&
    typeof Component.prototype.isReactComponent === 'object'
)



const toClass = baseComponent => {
  if (isClassComponent(baseComponent)) {
    return baseComponent
  }

  class ToClass extends React.Component {
    render() {
      if (typeof baseComponent === 'string') {
        return React.createElement(baseComponent, this.props)
      }
      return baseComponent(this.props, this.context)
    }
  }

  ToClass.displayName = getDisplayName(baseComponent)
  ToClass.propTypes = baseComponent.propTypes
  ToClass.contextTypes = baseComponent.contextTypes
  ToClass.defaultProps = baseComponent.defaultProps

  return ToClass
}

module.exports = toClass

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


/*
import observer from './observer/observer'
import {CreateState,globalState, globalActions}  from './proxyo/createState'
export {CreateState,globalState,
  globalActions,observer}
*/

/*
var observer = require('./observer/observer');
var observerLight = require('./observer/observerLight');
var proxyo = require('./proxyo/proxyo');*/
var observer = __webpack_require__(0);
var observerLight = __webpack_require__(0);
var proxyo = __webpack_require__(4);


module.exports = {
  observe:observer.observe,
  observable:observer.observable,
  observerLight:observerLight,
  isObservable:observer.isObservable,
  observer:observer,
  action:proxyo.action,
  computed:proxyo.computed,
  replaceState:proxyo.replaceState,
  state:proxyo.state,
  intercept:proxyo.intercept,
  connect: __webpack_require__(2),
  Provider: __webpack_require__(3),
}



/***/ })
/******/ ]);
});
//# sourceMappingURL=proxyo.js.map