
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
  observer,
  namespace:proxyo.namespace,
  State:proxyo.State,
  Actions:proxyo.Actions,
  intercept:proxyo.intercept,
  connect: require('./proxyo/hoc')
}