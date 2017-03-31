


import {observable, observe, action,isObservable,computed} from '../../../src/index'
/*

var todo = {
  value:'',
  id:Math.random(),
  complete:false

}

var todoStore = {
  todos : [],
  filter : "",
  firstName : 'guilherme',
  lastName : 'guerchmann',
  get fullName (){
    console.log('computing fullname')
    return this.firstName + '  ' + this.lastName
  },
  get filtredTodos (){
    var matchesFilter = new RegExp(this.filter,'i')
    return this.todos.filter(todo=> !this.filter || matchesFilter.test(todo.value))
  },
  createTodo (value){
      var newTodo = Object.assign({},todo)
      newTodo.value = value
      this.todos.push(newTodo)
  }
}

*/


class Todo {
  value
  id
  complete

  constructor(value){
    this.value = value
    this.id = Math.random()
    this.complete = false
  }
}


class TodoStore {
  todos = []
  filter = ""
  firstName = 'guilherme'
  lastName = 'guerchmann'
  get fullName (){
    console.log('computing fullname')
    return this.firstName + '  ' + this.lastName
  }


  get filtredTodos (){
    var matchesFilter = new RegExp(this.filter,'i')
    return this.todos.filter(todo=> !this.filter || matchesFilter.test(todo.value))
  }
  constructor(){
   /* observe( function (){
      console.log(this);
      console.log(this.firstName + ' ================= ' +this.lastName)
    },this)*/


    this.todos.push(new Todo('abigail'))
    this.todos.push(new Todo('leonardo'))



  }
  createTodo (value){
    this.todos.push(new Todo(value))

  }

  clearComplete (){
    console.log(this)
    const incompleteTodos = this.todos.filter(function(todo) {return !todo.complete})
    //   console.log(isObservable(incompleteTodos));
    this.todos = incompleteTodos
    // this.todos = []
  }
}
//window.Todo = Todo
//var store = window.store = observable(new TodoStore)






export default TodoStore
