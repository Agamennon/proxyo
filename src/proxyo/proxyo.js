

var observable = require('../observer/observer').observable
var interceptMap = require('../observer/observer').interceptMap


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
