var html = require('choo/html')
var Component = require('nanocomponent')
var Bitmap = require('../Bitmap')

var cursor = Bitmap('11111111\n10000001\n10000001\n10000001\n10000001\n10000001\n10000001\n11111111\n')

function TileSelector () {
  if (!(this instanceof TileSelector)) return new TileSelector()
  this.COLS = 8
  this.ROWS = 32

  Component.call(this)
}

TileSelector.prototype = Object.create(Component.prototype)

TileSelector.prototype.createElement = function (tiles, emit) {
  this.tiles = tiles
  this.selected = 0

  this.emit = emit

  return html`
    <canvas 
      width="256" 
      height="512"
      onclick=${this.handleClick.bind(this)}>
    </canvas>`
}

TileSelector.prototype.load = function (el) {
  this.el = el
  this.ctx = el.getContext('2d', { alpha: false })
  this.draw()
}

TileSelector.prototype.update = function (tiles, emit) {
  this.tiles = tiles
  this.emit = emit

  return false
}

TileSelector.prototype.draw = function () {
  this.ctx.fillStyle = 'black'
  this.ctx.fillRect(0, 0, 256, 512)

  var col, row, position

  this.tiles.forEach((tile, i) => {
    col = i % this.COLS
    row = Math.floor(i / 8)
    position = { x: col, y: row }

    this._drawTile(tile.texture, position, 'white')
  })

  col = this.selected % this.COLS
  row = Math.floor(this.selected / 8)
  position = { x: col, y: row }

  this._drawTile(cursor, position, 'yellow')
}

TileSelector.prototype.handleClick = function (e) {
  var col = Math.floor(e.offsetX / 32)
  var row = Math.floor(e.offsetY / 32)
  var tileIndex = (row * 8) + col

  this.select(tileIndex)
}

TileSelector.prototype.select = function (index) {
  this.selected = index
  this.draw()
}

TileSelector.prototype._drawTile = function (tile, position, color) {
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

module.exports = TileSelector()
