
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
var observer = require('./observer/observerLight');
var proxyo = require('./proxyo/proxyo');


module.exports = {
  observer:observer,
  observe:observer.observe,
  observable:observer.observable,
  createObserver:observer.createObserver,
  computedMap:observer.computedMap,
  isObservable:observer.isObservable,
  proxies:observer.proxies,
  toObservable:proxyo.toObservable,
  action:proxyo.action,
  proxyo:proxyo,
  computed:proxyo.computed,
  replaceState:proxyo.replaceState,
  state:proxyo.state,
  intercept:proxyo.intercept,
  connect: require('./proxyo/connect'),
  Provider: require('./proxyo/provider'),
}

