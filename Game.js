var html = require('choo/html')
var Component = require('nanocomponent')
var Scene = require('./Scene')

function Game () {
  if (!(this instanceof Game)) return new Game()

  Component.call(this)
}

Game.prototype = Object.create(Component.prototype)

Game.prototype.createElement = function (state, emit) {
  this.state = state
  this.emit = emit

  this.scene = Scene(state, emit)

  if (!this.el) {
    this.el = html`
      <canvas width="512" height="512">
        
      </canvas>`
    this.ctx = this.el.getContext('2d')
  }

  return this.el
}

Game.prototype.update = function (state, emit) {
  this.state = state
  this.emit = emit

  this.scene.render(this.ctx)

  return false
}

Game.prototype.load = function () {
  this.scene.render(this.ctx)

  document.addEventListener('keydown', e => {
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
  })
}

Game.prototype.move = function move (x, y) {
  var nextPosition = {
    x: this.state.player.position.x + x,
    y: this.state.player.position.y + y
  }

  this.state.player.position = this.scene.collision(nextPosition)
    ? this.state.player.position
    : nextPosition

  this.scene.render(this.ctx)
}

module.exports = Game()
