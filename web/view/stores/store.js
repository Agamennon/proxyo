import {State} from '../../../src/index'

var store1 =  {
  name : 'valrrrdfdfue',
  tel : '34223aaa4',
  that:this,
  get other () {
    return this.name + ' haha'
  },
  nested : {
    nestedMethod:()=>{
      console.log('heeelo from nested')

    },
    inside:{cock:'cooo',arr:[{a:1},{b:2}]},
    bab:'gui'
  },

  myaction(){
    console.log('my action called')
    this.name ='name from acion';
    //   console.log('this is my action')
  },
  otheraction(){
    this.name ='other';
    //   console.log('this is my action')
  }

}

var store2 =  {
  name : 'store2',
  tel : '34223aaa4',
  nested : {
    type:'gui'
  }
}

export {store1,store2}
