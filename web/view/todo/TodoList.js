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
})

@connect
export default class TodoList extends React.Component {

  filter(e){
    //this.props.store.filter = e.target.value
    this.props.todos.filter = e.target.value
    //console.log( this.props.todos.filter)
  }

  createNew(e){
    if (e.which == 13){
    //  this.props.store.createTodo(e.target.value)
      this.props.todos.createTodo(e.target.value)
      e.target.value = '';
    }
  }

  clearComplete(e){
    console.log('clearing')
    this.props.todos.clearComplete();
  }

  changeName (e){
    this.props.todos.firstName = e.target.value
  }

  changeLastName (e){
    this.props.todos.lastName = e.target.value
  }

  render(){
    console.log('render todo List')
    const {filter,filtredTodos,firstName,fullName,lastName,teste,fullNameUpper} = this.props.todos;

    const todoList = filtredTodos.map((todo,index) => {

      return (
          <TodoItem key={todo.id} merda="caraleo" value={todo.value} todo={todo} />
      )
    })

    /*const todoFullList = this.props.todos.todos.map((todo,index) => {

      return (
          <TodoItem key={todo.id} merda="caraleo" value={todo.value} todo={todo} />
      )
    })*/


 //   console.log(todoList);
    return (
    <div>
      <h1>teste = {teste}</h1>
      <h1>todos first name = {firstName}</h1>
      <h1>todos fullname = {fullName}</h1>
      <h1>todos fullname UPPER = {fullNameUpper}</h1>
      <input onKeyPress={this.createNew.bind(this)} />
      <input value={filter} onChange={this.filter.bind(this)}/>
      <input value={firstName} onChange={this.changeName.bind(this)}/>
      <input value={lastName} onChange={this.changeLastName.bind(this)}/>
      <ul>{todoList}</ul>

      <a href="#" onClick={(e)=>{this.clearComplete(e)}}>Clear Complete </a>
    </div>)
  }

}