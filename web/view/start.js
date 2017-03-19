//import {observer} from '../../src/index'
import ReactDOM from 'react-dom'
//import {store1} from './stores/store'
import {observer} from '../../src/index'
import React from 'react'
//import App from './app'
//import Counter from './counter'

import TodoList from './todo/TodoList'
import {Provider} from '../../src/index'
import todoStore from './todo/todoStore'

/*


var temp = observer.observable({name:'gui'});

var signal = observer.observe(()=>{
  console.log(temp.name)
})



setTimeout(()=>{
  console.log('temp changed should print below')
  temp.name = 'leo'
},1000)
*/



/*var nested = {
  nestedMethod:()=>{
    console.log('heeelo from nested')

  },
      inside:[{a:1},{b:2}],
      bab:'gui'
}

State.store1 = store1
//State.store1.nested = nested

intercept (State,'get','store1',function(target,prop,value){

  console.log(target);
  console.log(prop);
  console.log(value);
 // value = 'haha'
  //return target[prop]
})

console.log(State.store1)*/
//State.store1.tel ='heklo'
//State.store1.nested.inside.cock = 'changed'

//State.store1.nested.bab = 'aaaaa'
//State.store1.myaction();
//State.store1.myaction  = ()=>{console.log('new action')}
//State.store1.nested.nestedMethod()
//State.store1.name = 'aaa'
//State.store1.name = 'changaaaed'



//State.store1.name = 'aaa'
/*var a = {name:'gui',nested:{other:'leo'}};
var t = new Proxy(a,{
  get:function(a,b,c){
    console.log(a)
    console.log(b)
    console.log(c)
    return a[b]
  },
  set:function(a,b,c,d){
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
    if (typeof a === 'object'){
      new Proxya[b] = c
    }else{
      a[b] = c
    }

    return true
  }
})
//console.log(t.name)
t.nested.other = 'aaaa'
t.nested.other = 'aaaaaa'
t.name = 'aaaaaa'*/
//console.log(t.nested.other);
//console.log(t.name)
//State.store1.name = 'chvvvvanged'

//console.log(State.store1.name)
//console.log(State.store1.name)
//console.log(State.store1.name)

//State.nested.nestedMethod();
//namespace('store1',store1);

//State.superStore = store1;



/*
var obs = observable(store1)
//console.log(JSON.stringify(obs))
observe(()=>{
     console.log(obs.name)
})
*/

//console.log(State.store1.nested.bab)


/*State.store1.nested.nestedMethod = (a) => {
  console.log(a)
  console.log('nested called');
  //this.name='nested method'
  //State.store1.name ='nested method'
  //console.log(store1);
},*/
//Actions.store1.myaction()
//Actions.store1.myaction()
//Actions.store1.myaction()
//State.store1.outside = {a:1}

//Actions.store1.guiAction()


/*

observe(()=>{
  console.log('bab-'+State.store1.name)
},State)

setTimeout(()=>{
 // State.store1.name =' new name'
  //console.log(State.store1.name)
  State.store1.myaction()
 // State.store1.myaction('guo')
 // State.merda()
  //var t = State.store1.myaction
  //s.myaction();
 // console.log(State.store1.name)
},2000)
*/




//window.obs = obs;


ReactDOM.render(
    <Provider proxyoStores={todoStore}>
      <TodoList/>
    </Provider>
      ,
      document.getElementById('app')
  )


