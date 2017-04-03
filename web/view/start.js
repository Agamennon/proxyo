//import {observer} from '../../src/index'
import ReactDOM from 'react-dom'
//import {store1} from './stores/store'
import {observer,observable,observe,replaceState,toObservable,computed,test,action,observerLight,computedMap,proxies} from '../../src/index'
import React from 'react'
 import TodoList from './todo/TodoList'
 import {Provider} from '../../src/index'
 import todoStore from './todo/todoStore'
 //import todoViewModel from './todo/todoViewModal'


/*  const observable1 = observer.observable({prop: 'value1'})
 const observable2 = observer.observable({prop: 'value2'})

 let numOfRuns1 = 0
 let numOfRuns2 = 0
 function test1 () {
 observable1.prop = observable2.prop
 numOfRuns1++
 }
 function test2 () {
 observable2.prop = observable1.prop
 numOfRuns2++
 }
 observer.observe(test1)
 //setTimeout(()=>{
 observer.observe(test2)
 //},3000)

 //Promise.resolve().then(()=>{})

 Promise.resolve()
 .then(() => observable1.prop = 'Hello')
 .then(() => console.log('Hello =',observable2.prop))
 .then(() => observable2.prop = 'World!')
 .then(() => console.log('World! = ',observable1.prop))
 .then(() => {
 console.log('3 = ',numOfRuns1)
 console.log('3 = ',numOfRuns2)
 })*/






/*

 var o =  {
 a:10,
 get doubleA (){
 return a*2
 }
 }

 var temp = 1

 Object.defineProperty(o,'a',{
 enumerable: true,
 configurable: true,
 value:(function(){
 return (temp * 100)

 }()),
 writable:true,
 metadata:'hahahah'

 })

 var p = new Proxy(o,{
 get:function(target, key, receiver){
 console.log('get',key,target)
 return Reflect.get(target,key)
 },
 set:function(target,key, value, receiver){
 console.log('set',key,value)
 console.log(Object.getOwnPropertyDescriptor(target,key))
 return Reflect.set(target, key, value, receiver)
 }
 })

 console.log(p.a)
 p.a = 40
 console.log(p.b)
 console.log(o.b)
 */




/*

@toObservable
class testA {

  items = []
  addItem (value){
    this.items.push(value)
  }
  firstName = 'guilherme'
  lastName = 'guerchmann'

  @computed get  fullName (){

    return this.firstName + ' ' + this.lastName
  }
  @computed set fullName (val){
    this.firstName = val
  }

/!*  @computed  get fullNameUpper(){
    return this.fullName.toUpperCase()
  }
  @computed moreName (){
    return this.firstName + 'moreName'
  }
  @computed  get evenItems () {
    return this.items.filter((item,index)=>{
      return true
      //return ((index % 2) === 0)
    })
  }*!/
  constructor (){
    this.addItem('23231')
    this.addItem('333333')


  }
}

var obs = observer.observable(new testA());
observer.observe(function(arg){

  obs.fullName = 'hahahaha'
  //obs.firstName = 'gogogogo'

//  console.log('----------------------------------------------------->',obs.fullName)
  // console.log('----------------------------------------------------->',obs.fullNameUpper)
  console.log('----------------------------------------------------->',obs.firstName)
  console.log('----------------------------------------------------->',obs.fullName)

  // console.log('----------------------------------------------------->',obs.evenItems)
})


setTimeout(()=>{

  // obs.addItem('asdfasd')
  // obs.addItem('odaaaaad4')
  // console.log('doing timeout')
  obs.lastName = 'lego'
  // obs.lastName = 'goncalves'
},3000)


*/




 var state = replaceState ({
 todos:todoStore
 })


 ReactDOM.render(
 <Provider proxyoStores={state}>
 <TodoList/>
 </Provider>
 ,
 document.getElementById('app')
 )














/*

 const user = observable({
 firstName: "Michel",
 lastName: "Weststrate",
 // MobX computed attribute
 fullName: computed(function() {
 return this.firstName + " " + this.lastName
 })
 })
 */

/*var compu =  function(fn,context) {
 console.log(this)
 return fn.call(context)
 }

 function wrap(obj){
 // obj.fullName2.bind(compu)
 return obj
 }*/
/*
 function wrap(obj){
 // obj.fullName2.bind(compu)
 Reflect.ownKeys(obj).forEach((key)=>{
 console.log(obj[key])
 var descriptor = (Reflect.getOwnPropertyDescriptor(obj, key))
 if (Array.isArray(descriptor.value)){
 if (descriptor.value[0] === 'proxyo_computed'){
 descriptor.value = descriptor.value[1].call(obj)
 Reflect.defineProperty(obj,key,descriptor)

 }
 }

 })

 return obj
 }

 function compu (fn) {
 return ['proxyo_computed',fn]
 }



 var user = {
 firstName: "Michel",
 lastName: "Weststrate",
 get fullName2 (){

 return this.firstName + " " + this.lastName
 },
 fullname3 :function(){

 return 'ha'
 }(),
 fullName: compu(function(){

 //return this.firstName + " " + this.lastName
 })
 }



 console.log(user.fullname3);
 console.log(user.fullname3);
 console.log(user.fullname3);
 console.log(user.fullname3);
 console.log(user);
 console.log(user);
 console.log(user);
 console.log(user);
 console.log(user);



 user.lastName = "Vaillant"
 console.log(JSON.stringify(user));


 */

/*@test
 class teste {
 firstName = "michel"
 lastName = "wast"
 @computed get fullName (){
 console.log('-----computing full name ---------')
 return this.firstName + ' ' + this.lastName
 //return this.firstName + ' ' +  this.lastName
 }
 }
 var o = observable (new teste());
 console.log(JSON.stringify(o))
 console.log(o.fullName)
 console.log(o.fullName)
 console.log(o.fullName)
 console.log(o.fullName)
 console.log(o.fullName)
 console.log(o.fullName)
 console.log(o.fullName)

 console.log(o)*/



/*
 var count = {
 counter: 111,
 counter2: 222
 }
 let ooo = observer.observable(count)

 console.log('----------------------------------------------------------------------------------------------')

 observer.reaction(()=>{
 console.log(ooo.counter)
 console.log(ooo.counter2)
 },null,function(){
 console.log('i work dude')

 })

 setTimeout(()=>{
 console.log('doing')
 ooo.counter = 10
 ooo.counter2 = 30
 },2000)
 */




/*var todoProx = proxies.get(state.todos)
 console.log(computedMap.get(todoProx))*/


//setTimeout(()=>{
/*  observe(function() {
 // console.log(state.todos.firstName)
 // console.log(state.todos.firstName + ' ----------------------------------------------------------------------------')
 if (state.todos.firstName.length > 9) {
 console.log(state.todos.firstName + ' ----------------------------------------------------------------------------')
 state.todos.firstName = state.todos.firstName + ' o LONGO'
 }
 })*/
//},0)
/*

 var count = {
 counter: 111,
 counter2: 222
 }
 let ooo = observerLight.observable(count)

 observerLight.observe(()=>{
 console.log(ooo.counter)
 console.log(ooo.counter2)
 })


 setTimeout(()=>{
 console.log('doing')
 ooo.counter = 10
 ooo.counter2 = 30
 },100)
 */


