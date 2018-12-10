const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const metamaskLogo = require('metamask-logo')
const debounce = require('debounce')

module.exports = Mascot

inherits(Mascot, Component)
function Mascot ({width = '200', height = '200'}) {
  Component.call(this)
  this.width = width
  this.height = height
}

Mascot.prototype.render = function () {

  return h('#metamask-mascot-container', {
    style: {
      zIndex: 0,
      backgroundImage: 'url(images/metamonk.svg)',
      backgroundSize: 'contain',
      width: this.width,
      height: this.height,
    },
  })
}
