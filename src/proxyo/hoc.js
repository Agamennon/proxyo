

//import {observer} from '../index'
var observer = require('../observer/observer')


var React = require ('react');
var toClass = require ('./toClass');

//import React from 'react'
//HOC RENDER HIGHJACKING
var connect = (Comp,obs) => {
  console.log(obs)
  Comp = toClass(Comp);
  // console.log('connecting-');
  var signal;
  var renderResult
  var mounted = false;
  var obs = observer.observable(obs)

  class Enhancer extends Comp {

    constructor(props){
      super();
      this._fn = this._fn.bind(this);
      signal = null;
      mounted = false;
      renderResult = null;
    }

    _fn (){
      // console.log("CHANGE DETECTED")
      renderResult = super.render();
      if (mounted){
        this.forceUpdate();
      }
    }
    componentDidMount() {
      mounted = true;
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
    }

    componentWillUnmount() {
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
      mounted = false
      if (signal) {
        signal.unobserve();
        //  console.log("signal released")
      }
    }
    render() {
      //  console.log('--- HOC rendering --')
      this.props =  Object.assign({}, this.props, {state:obs})

    //  this.props =  obs;

      if (!mounted){
        signal = observer.observe(this._fn,this);
      }

      return renderResult
    }
  };

  function getDisplayName (Comp) {
    return Comp.displayName ||
        Comp.name || `Component`
  }

  Enhancer.displayName = `HOC(${getDisplayName(Comp)})`

  return Enhancer
}

module.exports = connect
//export default connect



