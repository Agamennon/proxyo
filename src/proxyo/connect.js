

var React = require ('react')
//var observer = require('../observer/observer')
var observer = require('../observer/observerFinal')
var isObjectShallowModified = require ('./isShallow');
var toClass = require ('./toClass');
var hoistStatics = require('./hoist-non-react-statics');



var connect = (...params) => {
//https://github.com/mobxjs/mobx-react/blob/master/src/inject.js
  //Comp = toClass(Comp);

  if (typeof params[0] === 'function'){
    //console.log ('sem opcoes vamos colocar tudo em um objeto store ou vamos colocar tudo em props?')
    var mode = 'noOptions'
  } else{

    if (!Array.isArray(params[0])){
       throw new Error("Store options must be an array");
    }
    var mode = 'withOptions'
    var options = params[0]
  }


  var factory = function (Comp){
    Comp = toClass(Comp);

    class Enhancer extends Comp {

      /* static contextTypes = {
       proxyoStores: React.PropTypes.object
       };*/

      constructor(props,context){

        //console.log('constructor');
        super(...arguments);

        this.obs = {};
        if (context.proxyoStores){
          this.obs = context.proxyoStores
        }




        //  console.log(context);
        this._fn = this._fn.bind(this);
        this._signal = null;
        this._mounted = false;
        this._renderResult = null;

      }

      _fn (){
        this._renderResult = super.render()
        if (this._mounted){
          console.log('change detected on '+getDisplayName(Comp))
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
       // delete this.props.store
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


        console.log('rendering HOC for -> '+getDisplayName(Comp))



        //this.props =  Object.assign({}, this.props, {store:obs})
        switch(mode) {
          case 'noOptions':
            this.props = Object.assign({}, this.obs, this.props)
            break
          case 'withOptions':
            var selection = {}
            var tt = options.map((value) => {
              if (value in this.obs) {
                selection[value] = this.obs[value]
              }
            })
            console.log('selection',selection);
            this.props = Object.assign({}, selection, this.props)
            break
        }




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


  if (typeof params[0] === 'function'){
    return factory(params[0])
  }
  return factory
  /*if (params.length === 0){
    //factory
    console.log('no params?')
    console.log(arguments)
    return factory(arguments[5])
  } else {
    return factory
  }

*/

}



module.exports = connect
//export default connect2



