/*

import {observable, observe, action,isObservable,computed, state, toObservable} from '../../../src/index'




class TodoStore {

    firstName = 'guilherme'
    lastName = 'guerchmann'

   /!*@computed get  fullName (){

      return this.firstName + ' ' + this.lastName
    }*!/
 /!* @computed get  fullNameUpper (){

    return this.fullName.toUpperCase()
  }*!/
     constructor(){

      }
}
export default  new TodoStore()
*/





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
  _someData = null

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
    return this.firstName + ' ' + this.lastName
  }
  @computed get fullNameUpper (){
    return this.fullName.toUpperCase()
  }


  @computed get filtredTodos (){
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


