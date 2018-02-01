var html = require('choo/html')
var Component = require('nanocomponent')
var randomBytes = require('randombytes')

var hero = [
  '00000000',
  '00000000',
  '01010001',
  '01110001',
  '01110010',
  '01111100',
  '00111100',
  '00100100'
]

function Game () {
  if (!(this instanceof Game)) return new Game()

  this.tileColor = 'blue'
  this.bgColor = 'white'
  this.tiles = Array(16).fill('').map(_ => Array(16).fill('0').map(_ => emptyTile()))
  this.player = {x: 0, y: 0}

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
  var nextX = this.player.x + x
  var nextY = this.player.y + y

  this.player.x = (nextX > 15 || nextX < 0) ? this.player.x : nextX
  this.player.y = (nextY > 15 || nextY < 0) ? this.player.y : nextY

  this.renderScene()
}

Game.prototype.renderScene = function () {
  this.drawBg()
  this.drawTiles()
  this.drawHero()
  this.drawGrid('grey')
}

Game.prototype.drawBg = function () {
  this.ctx.fillStyle = this.bgColor
  this.ctx.fillRect(0, 0, 512, 512)
}

Game.prototype.drawTiles = function () {
  this.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      this._drawTile(tile, { x, y }, this.tileColor)
    })
  })
}

Game.prototype.drawHero = function () {
  this._drawTile(hero, this.player, 'red')
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
  var rows = tile

  rows.forEach((row, rowIndex) => {
    row.split('').forEach((col, colIndex) => {
      if (+col) {
        var x = (position.x * 32) + (colIndex * 4)
        var y = (position.y * 32) + (rowIndex * 4)

        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, 4, 4)
      }
    })
  })
}

module.exports = Game

function emptyTile () {
  return Array(8).fill('00000000')
}

function randomTile () {
  var rows = []
  randomBytes(8).forEach(byte => {
    rows.push(byte.toString(2).padStart(8, '0'))
  })
  return rows
}
