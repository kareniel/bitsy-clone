var html = require('choo/html')
var css = require('sheetify')
var Component = require('nanocomponent')
var Scene = require('./Scene')
var nanobus = require('nanobus')
var MessageBox = require('./MessageBox')

function Game () {
  if (!(this instanceof Game)) return new Game()

  Component.call(this)
}

Game.prototype = Object.create(Component.prototype)

Game.prototype.createElement = function (state, emit) {
  this.state = state
  this._emit = emit

  if (!this.el) {
    var prefix = css`
      @font-face {
        font-family: 'msx';
        src: url('assets/MSX-Screen0.ttf') format("truetype");
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
        onkeypress=${this.handleKeyDown.bind(this)}>
        
      </canvas>`
    this.ctx = this.el.getContext('2d', {alpha: false})
  }

  return this.el
}

Game.prototype.update = function (state, emit) {
  this.state = state
  this._emit = emit

  this.draw()

  return false
}

Game.prototype.load = function (el) {
  this.el.focus()

  this.emitter = nanobus()
  this.scene = Scene(this.state, this.emitter.emit.bind(this.emitter))

  this.emitter.on('message', msg => {
    this.messageBox = MessageBox(this.ctx, msg)
    this.messageBox.on('close', () => {
      this.messageBox = null
      this.draw()
    })
  })

  this.draw()
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
      this.move(0, -1)
      break
    case 'ArrowLeft':
    case 'a':
      this.move(-1, 0)
      break
    case 'ArrowDown':
    case 's':
      this.move(0, 1)
      break
    case 'ArrowRight':
    case 'd':
      this.move(1, 0)
      break
    default:
      break
  }
}

Game.prototype.move = function move (x, y) {
  var nextPosition = {
    x: this.state.player.position.x + x,
    y: this.state.player.position.y + y
  }

  this.state.player.position = this.scene.collision(nextPosition)
    ? this.state.player.position
    : nextPosition

  this.draw()
}

Game.prototype.drawGrid = function () {
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
