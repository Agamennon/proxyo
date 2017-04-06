
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


    it('sould be sensible to component property', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }
      }

      var obs = observer.observable(new test());
      return Promise.resolve()
          .then(() => expect(obs.fullName).to.equal('guilherme goncalves'))
          .then(() => obs.firstName = 'gui')
          .then(() => expect(obs.fullName).to.equal('gui goncalves'))

    })

    it('sould be sensible to computed setter property', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }
        set fullName (val){
          this.firstName = val
        }
      }

      var obs = observer.observable(new test());
      return Promise.resolve()
          .then(() => expect(obs.fullName).to.equal('guilherme goncalves'))
          .then(() => obs.fullName = 'leonardo')
          .then(() => expect(obs.fullName).to.equal('leonardo goncalves'))

    })

    it('sould throw if setter is not defined and setting took place', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }

      }

      var obs = observer.observable(new test());
      return Promise.resolve()

          .then(() => expect(()=>{obs.fullName = 'leonardo'}).to.throw(TypeError))
    })

    it('calculated properties should run synchronosly', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }

        @computed get fullNameUpper (){
          return this.fullName.toUpperCase()
        }
      }

      var obs = observer.observable(new test());

      expect(obs.fullNameUpper).to.equal('GUILHERME GONCALVES')
      expect(obs.fullName).to.equal('guilherme goncalves')
      obs.firstName = 'gui'
      expect(obs.fullNameUpper).to.equal('GUI GONCALVES')

    })

    it('should trigger only once per cycle', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }

        @computed get fullNameUpper (){
          return this.fullName.toUpperCase()
        }
      }

      var obs = observer.observable(new test());
      var runs = 0
      var fullName = ''
      observer.observe(()=>{
        runs ++
        obs.fullName
        obs.firstName = 'leo'+runs
        obs.fullNameUpper
        fullName = obs.fullName
      })
      expect(runs).to.equal(1)
      return Promise.resolve()
          .then(() => expect(fullName).to.equal('leo1 goncalves'))
          .then(() => obs.lastName = 'mcnulty')
          .then(() => expect(fullName).to.equal('leo2 mcnulty'))
          .then(() => expect(runs).to.equal(2))
    })


    it('should not stringify computed properties', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }
      }
      var obs = observer.observable(new test())
      expect (JSON.parse(JSON.stringify(obs)).fullName).to.equal(undefined)
      expect (JSON.parse(JSON.stringify(obs)).firstName).to.equal('guilherme')

    })


    it('should work with functions', () => {

      @toObservable
      class test {
        firstName = "guilherme"
        lastName = "goncalves"

        @computed get fullName (){
          return this.firstName + ' ' + this.lastName
        }
      }
      var obs = observer.observable(new test())
      expect (JSON.parse(JSON.stringify(obs)).fullName).to.equal(undefined)
      expect (JSON.parse(JSON.stringify(obs)).firstName).to.equal('guilherme')

    })

  })
})

