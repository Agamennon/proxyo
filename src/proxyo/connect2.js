

var React = require ('react')
//var observer = require('../observer/observer')
var observer = require('../observer/observerFinal')
var isObjectShallowModified = require ('./isShallow');
var toClass = require ('./toClass');
var hoistStatics = require('./hoist-non-react-statics');



var connect2 = (Comp) => {

  return  class Enhancer extends Comp {

    constructor(props,context){
      super(...arguments);
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
      this._mounted = true;
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
    }

    shouldComponentUpdate(nextProps,nextState) {
      if (this.state !== nextState) {
        return true;
      }
      return isObjectShallowModified(this.props, nextProps);
    }

    componentWillUnmount() {
      if (super.componentWillUnmount){
        super.componentWillUnmount()
      }
      this._mounted = false
      if (this._signal) {
        this._signal.unobserve();
      }
    }
    render() {
      if (!this._mounted){

        this._signal = observer.observe(this._fn,this);
      }
      return this._renderResult
    }
  };

}


module.exports = connect2
//export default connect2



