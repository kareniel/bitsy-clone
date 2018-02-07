var html = require('choo/html')
var Component = require('nanocomponent')
var Bitmap = require('../Bitmap')

function SceneEditor () {
  if (!(this instanceof SceneEditor)) return new SceneEditor()

  this.layout = Bitmap.empty(16)

  Component.call(this)
}

SceneEditor.prototype = Object.create(Component.prototype)

SceneEditor.prototype.createElement = function (state, emit) {
  this.state = state
  this.emit = emit

  return html`
    <canvas
      width="512" 
      height="512"
      onclick=${this.handleClick.bind(this)}>
    </canvas>`
}

SceneEditor.prototype.load = function (el) {
  this.el = el
  this.ctx = el.getContext('2d')
  this.draw()
}

SceneEditor.prototype.update = function (state, emit) {
  this.state = state
  this.emit = emit

  return false
}

SceneEditor.prototype.handleClick = function (e) {
  var col = Math.floor(e.offsetX / 32)
  var row = Math.floor(e.offsetY / 32)

  this.layout[row][col] = this.state.selectedTile

  this.draw()
}

SceneEditor.prototype.draw = function () {
  this.ctx.fillStyle = 'black'
  this.ctx.fillRect(0, 0, 512, 512)

  this.drawTiles()
  this.drawGrid()
}

SceneEditor.prototype.drawGrid = function () {
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

SceneEditor.prototype.drawTiles = function () {
  this.layout.forEach((row, y) => {
    row.forEach((tileId, x) => {
      var tile = this.state.data.tiles[tileId]
      this._drawTile(tile.texture, { x, y }, 'white')
    })
  })
}

SceneEditor.prototype._drawTile = function (tile, position, color) {
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

module.exports = SceneEditor
