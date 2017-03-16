(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["proxyo"] = factory();
	else
		root["proxyo"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const nextTick = __webpack_require__(6)
const builtIns = __webpack_require__(5)
const wellKnowSymbols = __webpack_require__(7)

const proxies = new WeakMap()
const observers = new WeakMap()
const queuedObservers = new Set()
const enumerate = Symbol('enumerate')
let queued = false
let currentObserver
const handlers = {get, ownKeys, set, deleteProperty}

module.exports = {
  observe,
  observable,
  isObservable
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
  const observable = isObject && proxies.get(result)
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

function ownKeys (target) {
  registerObserver(target, enumerate)
  return Reflect.ownKeys(target)
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
/* 2 */
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
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const MapShim = __webpack_require__(1)
const SetShim = __webpack_require__(2)
const WeakMapShim = __webpack_require__(3)
const WeakSetShim = __webpack_require__(4)

module.exports = new Map([
  [Map, MapShim],
  [Set, SetShim],
  [WeakMap, WeakMapShim],
  [WeakSet, WeakSetShim],
  [Date, true],
  [RegExp, true]
])


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0)


/***/ })
/******/ ]);
});