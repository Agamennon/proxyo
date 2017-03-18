import {observable, observe, isObservable} from '../../../src/index'

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
    get filtredTodos (){
      var matchesFilter = new RegExp(this.filter,'i')
      return this.todos.filter(todo=> !this.filter || matchesFilter.test(todo.value))
    }
    constructor(){

         this.todos.push(new Todo('abigail'))
         this.todos.push(new Todo('leonardo'))



    }
    createTodo (value){
      this.todos.push(new Todo(value))

    }

    clearComplete (){
      console.log(this)
      const incompleteTodos = this.todos.filter(function(todo) {return !todo.complete})
      console.log(isObservable(incompleteTodos));
      this.todos = incompleteTodos
    }
}
window.Todo = Todo
var store = window.store = observable(new TodoStore)

export default (store)


