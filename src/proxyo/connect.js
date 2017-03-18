

var React = require ('react')
var observer = require('../observer/observer')
var isObjectShallowModified = require ('./isShallow');
var toClass = require ('./toClass');
var hoistStatics = require('./hoist-non-react-statics');

var connect = (Comp,obs) => {
//https://github.com/mobxjs/mobx-react/blob/master/src/inject.js
  Comp = toClass(Comp);

  class Enhancer extends Comp {

   /* static contextTypes = {
      proxyoStores: React.PropTypes.object
    };*/

    constructor(props,context){

    //  console.log('constructor');
      super(...arguments);
    //  console.log(context);
      this._fn = this._fn.bind(this);
      this._signal = null;
      this._mounted = false;
      this._renderResult = null;
    }

    _fn (){
      this._renderResult = super.render()
      if (this._mounted){
        this.forceUpdate()
      }
    }

    componentDidMount() {
     // console.log('did mount')
      this._mounted = true;
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
    }

     shouldComponentUpdate(nextProps,nextState) {
      //return false
      delete this.props.store
    //  console.log(this.props)
    //  console.log(nextProps)
    //  console.log(isObjectShallowModified(this.props, nextProps));
      if (this.state !== nextState) {
         return true;
       }
      return isObjectShallowModified(this.props, nextProps);

     }

    componentWillUnmount() {
   //   console.log('willunmount')
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
      this._mounted = false
      if (this._signal) {
        this._signal.unobserve();
        //  console.log("signal released")
      }
    }
    render() {
     this.props =  Object.assign({}, this.props, {store:obs})
//     console.log('render called ->', Comp.name)
     if (!this._mounted){
        this._signal = observer.observe(this._fn,this);
      }
     return this._renderResult
    }
  };

  function getDisplayName (Comp) {
    return Comp.displayName ||
        Comp.name || `Component`
  }

  Enhancer.displayName = `HOCProxyo(${getDisplayName(Comp)})`

  Enhancer.contextTypes = {
    proxyoStores: React.PropTypes.object
  };

  hoistStatics(Enhancer,Comp)

  return Enhancer
}



module.exports = connect
//export default connect2



