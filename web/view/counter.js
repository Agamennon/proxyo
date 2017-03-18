import React from 'react'
import {connect} from '../../src/index'
import {namespace} from '../../src/index'

import {State} from '../../src/index'



  var counter  = {
    // Initial State
    count: 0 ,
    // Actions
    increment: function() {
     // console.log(counter)
      this.count++
    },
    decrement: function() {
  //    console.log(counter)
      this.count--
    }
  }

class Counter  {


  constructor () {
    this.count = 1

  }

  doubleCount (){
    return this.count * 2
  }

  increment (){
    this.count ++
  }
  decrement (){
    this.count --
  }

}


State.counter = new Counter();
console.log(State.$raw.counter);

window.state = State;

export default connect((props) => {

  console.log('render')
  console.log(props.state)
  const decrement = (e)=> {
    props.state
  }

  return (
      <div>
        <h1>{ props.state.count }</h1>
        <button onClick={props.state.increment}>Increment</button>
        <button onClick={()=>{props.state.decrement()}} >Decrement</button>
        <br />
       {/* <button onClick={ Actions.incrementAsync }>Increment Async</button>*/}
      </div>
  )
},State.counter)


