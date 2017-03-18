
/*
import observer from './observer/observer'
import {CreateState,globalState, globalActions}  from './proxyo/createState'
export {CreateState,globalState,
  globalActions,observer}
*/
var observer = require('./observer/observer');
var proxyo = require('./proxyo/proxyo');

module.exports = {
  observe:observer.observe,
  observable:observer.observable,
  isObservable:observer.isObservable,
  observer:observer,
  State:proxyo.State,
  intercept:proxyo.intercept,
  connect: require('./proxyo/connect'),
  Provider: require('./proxyo/provider'),
}