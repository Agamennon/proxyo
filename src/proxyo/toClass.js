var React = require('react')

const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

const isClassComponent = Component => Boolean(
    Component &&
    Component.prototype &&
    typeof Component.prototype.isReactComponent === 'object'
)



const toClass = baseComponent => {
  if (isClassComponent(baseComponent)) {
    return baseComponent
  }

  class ToClass extends React.Component {
    render() {
      if (typeof baseComponent === 'string') {
        return React.createElement(baseComponent, this.props)
      }
      return baseComponent(this.props, this.context)
    }
  }

  ToClass.displayName = getDisplayName(baseComponent)
  ToClass.propTypes = baseComponent.propTypes
  ToClass.contextTypes = baseComponent.contextTypes
  ToClass.defaultProps = baseComponent.defaultProps

  return ToClass
}

module.exports = toClass