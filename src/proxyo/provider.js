
var React = require('react')

const specialReactKeys = {children: true, key: true, ref: true};



class Provider extends React.Component {

/*  static contextTypes = {proxyoStores: React.PropTypes.object};

  static childContextTypes = {proxyoStores: React.PropTypes.object.isRequired};*/

  render() {
    return React.Children.only(this.props.children);
  }

  getChildContext() {
  //  console.log(this.props);
   // const stores = {};
    // inherit stores
 /*   const baseStores = this.context.proxyoStores;
    if (baseStores)
      for (let key in baseStores) {
        stores[key] = baseStores[key];
      }
    // add own stores
    for (let key in this.props)
      stores[key] = this.props[key];
    console.log(stores);*/
    return {proxyoStores: this.props.proxyoStores};
  }

}

Provider.contextTypes = {proxyoStores: React.PropTypes.object};
Provider.childContextTypes = {proxyoStores: React.PropTypes.object.isRequired};

module.exports = Provider


