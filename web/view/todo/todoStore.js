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
    todos = []
    filter = ""
    firstName = 'guilherme'
    lastName = 'guerchmann'

    @computed get fullName (){
      console.log('-----computing full name ---------')
      return this.firstName + ' ' + this.lastName
    }
    @computed get fullNameUpper (){
     console.log('-----computing full name UPPER---------')
     return (this.firstName + ' ' + this.lastName).toUpperCase()
    }
    get filtredTodos (){
      var matchesFilter = new RegExp(this.filter,'i')
      return this.todos.filter(todo=> !this.filter || matchesFilter.test(todo.value))
    }
     constructor(state){
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

