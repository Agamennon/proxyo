/*var observable = require('../observer/observer').observable
 var interceptMap = require('../observer/observer').interceptMap
 var observer = require('../observer/observer')*/
var observable = require('../observer/observerLight').observable
var observer = require('../observer/observerLight')

var computedMap = {};

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

/*
 function computed (fn,key){

 var comp = computedMap.get(this)
 var keys

 function wrap(){
 var res = fn()
 keys.set(key,res)
 }
 if (!comp){

 keys = new Map()
 computedMap.set(this,keys)

 var signal = observer.observe(wrap,this)
 return keys.get(key)
 } else{
 return comp.get(key)
 }


 return keys ? keys.get(key) : 'lendo'

 //return 'hello'
 }*/


function test(target){

  console.log(target.prototype.constructor.name)
  var c = target.prototype.constructor
  var b = target.prototype.createTodo
  target.prototype.createTodo = function(...args){
    console.log('look ,... my yodo')
    console.log(args)
    console.log(this)

    b.apply(this,args)

  }
//  target.prototype.proxyoObj = {computed:['a']}


  return class extends target {

    //  static get name() { return target.name }
    //  static getClassName(){ return target.name }
    //static proxyoObj = {computed:[]}

    constructor(...args) {
      var comp = computedMap[target.name]
      console.log(target)
      var proxyoTEMP = target.prototype.__proxyoTEMP
      console.log(proxyoTEMP)



      console.log(Object.getOwnPropertyDescriptor(target.prototype, 'fullName').__proto__.meta)
      var computedResults = {}
      console.log("modified constructor");
      console.log(target.name)
      console.log(target.prototype)

      // console.log(Object.getOwnPropertyDescriptor(target.prototype, 'fullName'))
      let beforeSuper = true
      Object.keys(comp).forEach((key)=>{
        Object.defineProperty(target.prototype, key, {
          enumerable: false,
          configurable: true,
          get: function(){
            return computedResults[key]
          }
        });
      })
      // Object.defineProperty(target,'proxyoO',{enumerable:true,writable:true,configurable:true,value:{b:'b'}})
      super();



      var thisObs = observable(this);
      function computedWraper(key){
        computedResults[key] = comp[key].call(this)
      }
      console.log(thisObs)
      Object.keys(comp).forEach((key)=>{
        console.log(key)
        observer.observe(computedWraper,thisObs,key)
      })
      //console.log(thisObs.constructor.fullName)



      /*   computedMap[target.name].forEach((key)=>{
       // this[]
       console.log(key)
       console.log(thisObs[key])
       })*/


    }
  }



}

function computed (target, key , descriptor) {

  //Object.defineProperty(target,'ppp',{enumerable:true,writable:true,configurable:true,value:{b:'b'}})


  /*console.log(target)
   console.log(target.constructor)
   console.log(target.constructor.prototype)
   */
  console.log(target.constructor.prototype)
  var proxyoTEMP = target.constructor.prototype.__proxyoTEMP
  if (!proxyoTEMP){
    proxyoTEMP = target.constructor.prototype.__proxyoTEMP = {
      computed:[]
    }
  }
  proxyoTEMP.computed.push({
    key:key,
    get:descriptor.get,
    set:descriptor.set
  })

  console.log(proxyoTEMP)
  // descriptor.configurable = {'metadata':'haha'}

  //descriptor.__proto__.__meta = function(){return{'metadata':'haha'}}
  var className = target.constructor.name
  var theHash = computedMap[className]
  if (theHash){
    if (theHash[key]){
      theHash[key] = descriptor.get;
    }
  }
  else {
    computedMap[className]  = {[key]:descriptor.get}
  }
  return descriptor
  //descriptor.get()
//  console.log(descriptor)

  // console.log(target.__proto__.constructor.getOwnPropertyNames)
//  console.log(target.getOwnPropertyNames())
  //console.log(target.proxyoO)
  //console.log(new target.constructor().__proto__.proxyoObj)

  //target.merda = 'merda'
  //Reflect.setPrototypeOf(target,Object.assign({teste:'gui'},target.prototype))
  //console.log(target)
  // console.log(descriptor)
  // console.log(Reflect.has(target,'proxyoObj'))


  // console.log(target.className())
  /* console.log(target.proxyoObj)
   console.log(target.proxyoObj)
   console.log(target.constructor.proxyoObj)
   */

  // target.__proto__.constructor = null


  //  var userComputedGet = descriptor.get
  // computedMap.set(target,new Set().add(userComputedGet))
  /* descriptor.get = function(){


   var comp = computedMap.get(this);
   var keyMap
   function wrap (){

   var res = userComputedGet.apply(this)

   comp.set(key,res)
   }

   if (!comp){
   keyMap = new Map()
   computedMap.set(this,keyMap)
   comp = computedMap.get(this);
   var signal = observer.observe(wrap,this)
   }
   console.log(comp.get(key))

   return comp.get(key)
   }*/
  //register observer on userComputedGet
  //
}

function computed2 (...params){

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
    var oo =  observer.proxies.get(this) || observable(this)

    if (!signal){

      //var ctx =
      console.log('NO SIGNAL')
      //wraper.apply(this,arguments)
      //  Promise.resolve().then(()=>{

      signal = observer.observe(wraper,oo)
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
  test,
  computedMap,
  action
}


/// PROXYO