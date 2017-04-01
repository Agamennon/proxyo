import {observable, observe, action,isObservable,computed, state, toObservable} from '../../../src/index'



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


@toObservable
class TodoStore {
    todos = observable([])
    filter = ""
    firstName = 'guilherme'
    lastName = 'guerchmann'

    get  fullName (){
      console.log('computing name')
      return this.firstName + ' ' + this.lastName
    }
    get fullNameUpper (){
     return (this.firstName + ' ' + this.lastName).toUpperCase()
    }
   get filtredTodos (){
      var matchesFilter = new RegExp(this.filter,'i')
      return this.todos.filter(todo=> !this.filter || matchesFilter.test(todo.value))
    }
     teste (){
     return 10
    }
     constructor(){

         this.todos.push(new Todo('abigail'))
         this.todos.push(new Todo('leonardo'))
    }
    createTodo (value){
      this.todos.push(new Todo(value))
    }
    clearComplete (){
      const incompleteTodos = this.todos.filter(function(todo) {return !todo.complete})
      this.todos = incompleteTodos
    }
}
export default  new TodoStore()

