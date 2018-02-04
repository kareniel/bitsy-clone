var html = require('choo/html')
var css = require('sheetify')
var Component = require('nanocomponent')
var MessageBox = require('./MessageBox')
var Scene = require('./Scene')
var nanobus = require('nanobus')
var Player = require('./Player')

function Game () {
  if (!(this instanceof Game)) return new Game()

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
      box-shadow: 2px 2px 5px rgba(26,32,38,0.3);
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
  this.emitter = nanobus()
  this.messageBox = null
  this.player = Player(this.state.player.texture)
  this.loadScene(this.state.scenes[0])
  this.player.teleport(this.state.player.position, this.scene)

  this.loadGameEventHandlers()
  this.el.focus()
  this.draw()
}

Game.prototype.update = function (state, emit) {
  console.log('update')
  this.state = state
  this._emit = emit

  this.draw()

  return false
}

Game.prototype.draw = function () {
  if (this.cleared) return
  console.log('draw')
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

Game.prototype.loadGameEventHandlers = function () {
  this.emitter.on('message', message.bind(this))
  this.emitter.on('teleport', teleport.bind(this))
  this.emitter.on('ending', ending.bind(this))

  function message (msg) {
    this.messageBox = MessageBox(this.ctx)
    this.messageBox.dialog(msg)
    this.messageBox.on('close', () => {
      this.messageBox = null
      this.draw()
    })
  }

  function teleport (payload) {
    var parts = payload.split('\n').map(h => parseInt(h, 2))

    var sceneId = parts[0]
    var x = parts[1]
    var y = parts[2]

    var scene = this.state.scenes[sceneId]
    var position = { x, y }

    this.loadScene(scene)
    this.player.teleport(position, this.scene)
  }

  function ending (msg) {
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, 512, 512)
    this.cleared = true

    this.messageBox = MessageBox(this.ctx)
    this.messageBox.dialog(msg)
    this.messageBox.on('close', () => {
      this.messageBox = null
      this.reset()
    })
  }
}

Game.prototype.loadScene = function (scene) {
  var state = {
    player: this.player,
    tiles: this.state.tiles,
    gameEvents: this.state.gameEvents,
    scene: scene
  }

  this.scene = Scene(state, this.emitter.emit.bind(this.emitter))
}

Game.prototype.drawGrid = function () {
  if (!this.state.config.grid) return

  var size = 32

  this.ctx.fillStyle = '#272F35'

  for (var x = 1; x < 16; x++) {
    this.ctx.fillRect(x * size, 0, 1, 512)
  }

  for (var y = 1; y < 16; y++) {
    this.ctx.fillRect(0, y * size, 512, 1)
  }
}

Game.prototype.reset = function () {
  this.cleared = false
  this.load()
}

module.exports = Game()
