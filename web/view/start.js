//import {observer} from '../../src/index'
import ReactDOM from 'react-dom'
//import {store1} from './stores/store'
import {observer,observable,observe,replaceState,toObservable,computed,action,observerLight,computedMap,proxies} from '../../src/index'

/*

import React from 'react'
 import TodoList from './todo/TodoList'
 import {Provider} from '../../src/index'
 import todoStore from './todo/todoStore'
 //import todoViewModel from './todo/todoViewModal'


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
*/



@toObservable
class otherClass {
    name = 'falcor'
    constructor(){}

}
var other = observable(new otherClass())
observer.observe(function(){
    console.log('from other ---- >',other.name)
})



@toObservable
class testA {
  _someData = null
  items = []


  firstName = 'guilherme'
  lastName = 'guerchmann'

  addItem (value){
    this.items.push(value)
  }
  fetchSome (){
    console.log('fetching some data')
    setTimeout(()=>{
      this._someData = 'here is your data'
    },2000)
  }
  @computed get someData(){
    if (this._someData === null){
      this.fetchSome();
    }
    return this._someData
  }


   @computed get  fullName (){
    //console.log('performing the acutual computation ',this.firstName)
    return this.firstName + ' ' + this.lastName
  }
   set fullName (val){
    console.log('setting firstName to ',val)
    //other.name = 'novo nome dode'
    this.firstName = val

  }

    get fullNameUpper(){
    return this.fullName.toUpperCase()
  }
   moreName (){
    return this.firstName + 'moreName'
  }
    get evenItems () {
    return this.items.filter((item,index)=>{
      return true
      //return ((index % 2) === 0)
    })
  }
  constructor (){
   // this.addItem('23231')
   // this.addItem('333333')


  }
}

var obs = observer.observable(new testA());
observer.observe(function(arg){

  console.log('----------------------------------------------------->',obs.lastName)

 obs.fullName = 'hahahaha'
  //obs.fullName = 'gogogogo'
//  console.log('----------------------------------------------------->',obs.fullName)
  // console.log('----------------------------------------------------->',obs.fullNameUpper)
  console.log('----------------------------------------------------->',obs.fullName)


  console.log('OTHER NAME----------------------------------------------------->',other.name)
  other.name = 'mangoose'
  obs.fullName= 'lalalala'
  console.log('----------------------------------------------------->',obs.fullName)

  //console.log('some data ------------------------------------------->',obs.someData)
  // console.log('----------------------------------------------------->',obs.evenItems)
})


setTimeout(()=>{

  // obs.addItem('asdfasd')
  // obs.addItem('odaaaaad4')
  // console.log('doing timeout')
  other.name = 'not mang'
 // obs.lastName = 'lego'

  // obs.lastName = 'goncalves'
},4000)





