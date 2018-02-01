var html = require('choo/html')
var Component = require('nanocomponent')
var Scene = require('./Scene')
var Texture = require('./Texture')
var { cat } = require('./textures')

var hero = Texture(cat)

function Game () {
  if (!(this instanceof Game)) return new Game()

  this.tileColor = 'blue'
  this.bgColor = 'white'
  this.scene = Scene()
  this.player = {
    position: {
      x: 2,
      y: 2
    }
  }

  Component.call(this)
}

Game.prototype = Object.create(Component.prototype)

Game.prototype.createElement = function (state, emit) {
  this.state = state
  this.emit = emit

  if (!this.el) {
    this.el = html`
      <canvas width="512" height="512" style="border: 1px solid grey"> 
      </canvas>`
    this.ctx = this.el.getContext('2d')
  }

  return this.el
}

Game.prototype.update = function (state, emit) {
  this.state = state
  this.emit = emit

  this.renderScene()

  return false
}

Game.prototype.load = function () {
  this.renderScene()

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowDown':
        this.move(0, 1)
        break
      case 'ArrowUp':
        this.move(0, -1)
        break
      case 'ArrowLeft':
        this.move(-1, 0)
        break
      case 'ArrowRight':
        this.move(1, 0)
        break
      default:
        break
    }
  })
}

Game.prototype.move = function move (x, y) {
  var nextPosition = {
    x: this.player.position.x + x,
    y: this.player.position.y + y
  }

  this.player.position = this.scene.collision(nextPosition)
    ? this.player.position
    : nextPosition

  this.renderScene()
}

Game.prototype.renderScene = function () {
  this.drawBg()
  // this.drawGrid('grey')
  this.drawTiles()
  this.drawHero()
}

Game.prototype.drawBg = function () {
  this.ctx.fillStyle = this.bgColor
  this.ctx.fillRect(0, 0, 512, 512)
}

Game.prototype.drawTiles = function () {
  this.scene.tileMap.forEach((row, y) => {
    row.forEach((tileId, x) => {
      var tile = this.scene.tiles[tileId]
      this._drawTile(tile.texture, { x, y }, this.tileColor)
    })
  })
}

Game.prototype.drawHero = function () {
  this._drawTile(hero, this.player.position, 'red')
}

Game.prototype.drawGrid = function (color) {
  var size = 32

  this.ctx.strokeStyle = color

  for (var i = 0; i < size; i++) {
    var position = i * size

    this.ctx.beginPath()
    this.ctx.moveTo(position, 0)
    this.ctx.lineTo(position, 512)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(0, position)
    this.ctx.lineTo(512, position)
    this.ctx.stroke()
  }
}

Game.prototype._drawTile = function (tile, position, color) {
  tile.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        var x = (position.x * 32) + (colIndex * 4)
        var y = (position.y * 32) + (rowIndex * 4)

        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, 4, 4)
      }
    })
  })
}

module.exports = Game
