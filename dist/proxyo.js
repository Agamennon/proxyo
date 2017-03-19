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

/*  console.log("proxyo get key- ",key)
  console.log("proxyo get target- ",target)
  console.log("proxyo get receiver- ",receiver)*/
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



/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {



var React = __webpack_require__ (1)
var observer = __webpack_require__(0)
var isObjectShallowModified = __webpack_require__ (13);
var toClass = __webpack_require__ (14);
var hoistStatics = __webpack_require__(12);

var connect = (Comp,obs) => {
//https://github.com/mobxjs/mobx-react/blob/master/src/inject.js
  Comp = toClass(Comp);

  class Enhancer extends Comp {

   /* static contextTypes = {
      proxyoStores: React.PropTypes.object
    };*/

    constructor(props,context){

    //  console.log('constructor');
      super(...arguments);
    //  console.log(context);
      this._fn = this._fn.bind(this);
      this._signal = null;
      this._mounted = false;
      this._renderResult = null;
    }

    _fn (){
      this._renderResult = super.render()
      if (this._mounted){
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
      delete this.props.store
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
     this.props =  Object.assign({}, this.props, {store:obs})
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



var observable = __webpack_require__(0).observable
var interceptMap = __webpack_require__(0).interceptMap


var intercept = function(target,method,property,interceptor){
  interceptMap.set(target,[method,property,interceptor])
}

var State = function(state){
  return observable(state);
}

module.exports = {
  intercept,
  State
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
var observer = __webpack_require__(0);
var proxyo = __webpack_require__(4);

module.exports = {
  observe:observer.observe,
  observable:observer.observable,
  isObservable:observer.isObservable,
  observer:observer,
  State:proxyo.State,
  intercept:proxyo.intercept,
  connect: __webpack_require__(2),
  Provider: __webpack_require__(3),
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=proxyo.js.map