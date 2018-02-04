var html = require('choo/html')
var css = require('sheetify')
var Component = require('nanocomponent')
var MessageBox = require('./MessageBox')
var Scene = require('./Scene')
var nanobus = require('nanobus')
var Player = require('./Player')

function Game () {
  if (!(this instanceof Game)) return new Game()

  this.emitter = nanobus()
  this.messageBox = null

  this.emitter.on('message', msg => {
    this.messageBox = MessageBox(this.ctx)
    this.messageBox.dialog(msg)
    this.messageBox.on('close', () => {
      this.messageBox = null
      this.draw()
    })
  })

  Component.call(this)
}

Game.prototype = Object.create(Component.prototype)

Game.prototype.createElement = function (state, emit) {
  this.state = state
  this._emit = emit

  var prefix = css`
    @font-face {
      font-family: 'msx';
      src: url('/assets/MSX-Screen0.ttf') format("truetype");
    }

    :host {
      font-smooth: never;
      text-rendering: geometricPrecision !important;
      -webkit-font-smoothing: none !important;
    }
  `

  this.el = html`
    <canvas 
      tabindex=0
      width="512" 
      height="512"
      class=${prefix}
      onkeydown=${this.handleKeyDown.bind(this)}>
      
    </canvas>`
  this.ctx = this.el.getContext('2d', {alpha: false})

  return this.el
}

Game.prototype.load = function (el) {
  this.scene = Scene(this.state, this.emitter.emit.bind(this.emitter))
  this.player = Player(this.scene, this.state.player.position)

  this.el.focus()
  this.draw()
}

Game.prototype.update = function (state, emit) {
  this.state = state
  this._emit = emit

  this.draw()

  return false
}

Game.prototype.draw = function () {
  this.scene.render(this.ctx)
  this.drawGrid()
}

Game.prototype.handleKeyDown = function (e) {
  if (this.messageBox) {
    return this.messageBox.handleKeyDown()
  }

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      this.player.move({ x: 0, y: -1 })
      break
    case 'ArrowLeft':
    case 'a':
      this.player.move({ x: -1, y: 0 })
      break
    case 'ArrowDown':
    case 's':
      this.player.move({ x: 0, y: 1 })
      break
    case 'ArrowRight':
    case 'd':
      this.player.move({ x: 1, y: 0 })
      break
    default:
      break
  }

  this.draw()
}

Game.prototype.drawGrid = function () {
  if (!this.state.config.grid) return

  var size = 32

  this.ctx.fillStyle = 'white'

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      this.ctx.fillRect(x * size, y * size, 1, 512)
      this.ctx.fillRect(x * size, y * size, 512, 1)
    }
  }
}

module.exports = Game()
