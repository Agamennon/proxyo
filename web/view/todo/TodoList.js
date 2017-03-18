import React from 'react'
import {connect} from '../../../src/index'
import todoStore from '../todo/todoStore'


var TodoItem = connect( class TodoItem extends React.Component {

  toggleComplete (todo){
    todo.complete = !todo.complete
  }

  render (){
    var {todo} = this.props
  //  console.log('rendereing todo ListITEM')
    return <li>
      <input type="checkbox" onChange={this.toggleComplete.bind(this,todo)} value={todo.complete} checked={todo.complete}/>
      {todo.value}
    </li>

  }
},todoStore)


export default connect(class TodoList extends React.Component {

  filter(e){
    //this.props.store.filter = e.target.value
    todoStore.filter = e.target.value
  }

  createNew(e){
    if (e.which == 13){
    //  this.props.store.createTodo(e.target.value)
      todoStore.createTodo(e.target.value)
      e.target.value = '';
    }
  }

  clearComplete(){
    todoStore.clearComplete();
  }


  render(){
     console.log('render todo List')
   // const {todos,filter,filtredTodos,clearComplete} = this.props.store;
    const {todos,filter,filtredTodos,clearComplete} = this.props.store;

    const todoList = filtredTodos.map((todo,index) => {

      return (
          <TodoItem key={todo.id} merda="caraleo" value={todo.value} todo={todo} />
      )
    })


 //   console.log(todoList);
    return (<div key="munga">
      <h1>todos</h1>
      <input onKeyPress={this.createNew.bind(this)} />
      <input value={filter} onChange={this.filter.bind(this)}/>
      <ul>{todoList}</ul>
      <a href="#" onClick={clearComplete}>Clear Complete </a>
    </div>)
  }

},todoStore)