import React from 'react'
import {connect} from '../../src/index'
import {namespace} from '../../src/index'
import {store1,store2} from './stores/store'
import {State} from '../../src/index'

State.store1 = store1
console.log(State)

//var store = namespace('store1',store1);


var testeComp =(props) => {

  const changeName = (e) => {

   // props.myaction();
    //console.log(e.target.value);
     props.state.nested.bab = e.target.value
    // props.state.name = e.target.value
  };
  console.log(props);
  return <div>
    <input onChange={changeName}/>
    hello  {props.state.nested.bab}

  </div>
}
/*testeComp.propTypes = {
  name: React.PropTypes.string.isRequired
}*/

export default connect(testeComp,State.store1)


