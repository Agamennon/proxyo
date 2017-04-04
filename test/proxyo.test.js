
const expect = require('chai').expect
const observer = require('../src/index').observer
const proxyo = require('../src/index').proxyo
var toObservable = proxyo.toObservable
var computed = proxyo.computed

describe('proxyo', () => {
  describe('computed', () => {


    it('sould compute only once', () => {


      var count = 0
      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          console.log('----------------------------------------------------------')
          count++
          return this.firstName + ' ' + this.lastName
        }
      }

      var obs = observer.observable(new test());

      return Promise.resolve()
          .then(() => expect(obs.fullName).to.equal('guilherme goncalves'))
          .then(() => expect(count).to.equal(1))
          .then(() => expect(obs.fullName).to.equal('guilherme goncalves'))
          .then(() => expect(count).to.equal(1))
          .then(() => obs.firstName = 'gui')
          .then(() => expect(obs.fullName).to.equal('gui goncalves'))
          .then(() => expect(count).to.equal(2))

    })

    it('sould compute only when observed', () => {

      var hascomputed = false
      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          hascomputed = true
          return this.firstName + ' ' + this.lastName
        }
      }

      var obs = observer.observable(new test());
      return Promise.resolve()
          .then(() => expect(hascomputed).to.equal(false))
          .then(() => obs.fullName)
          .then(() => expect(hascomputed).to.equal(true))

    })


    it('sould work with nested computed properties and order of invocation should not matter', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          hascomputed = true
          return this.firstName + ' ' + this.lastName
        }

        @computed get fullNameUpper (){
          return this.fullName.toUpperCase()
        }
      }

      var obs = observer.observable(new test());
      return Promise.resolve()
          .then(() => expect(obs.fullNameUpper).to.equal('GUILHERME GONCALVES'))
          .then(() => expect(obs.fullName).to.equal('guilherme goncalves'))
          .then(() => obs.firstName = 'gui')
          .then(() => expect(obs.fullNameUpper).to.equal('GUI GONCALVES'))

    })
  })
})

