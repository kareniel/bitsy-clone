function Scene (state, emit) {
  if (!(this instanceof Scene)) return new Scene(state, emit)

  var { player, tiles, gameEvents, scene } = state

  this.player = player

  this.tiles = tiles
  this.gameEvents = gameEvents

  this.eventMap = scene.eventMap
  this.colors = scene.colors
  this.tileMap = scene.tileMap

  this.emit = emit
}

Scene.prototype.collision = function (pos) {
  if (outOfBounds(pos)) return true

  var tileId = this.tileMap.layout[pos.y][pos.x]
  var eventId = this.eventMap.layout[pos.y][pos.x]
  var tile = this.tiles[tileId]
  var event = this.gameEvents[eventId]

  if (typeof event.interact === 'function') event.interact.call(this)

  return tile.blocking || event.blocking
}

Scene.prototype.render = function (ctx) {
  this.ctx = ctx

  this.drawBg()
  this.drawTiles()
  this.drawHero()
  this.drawEventTiles()
  this.drawGrid()
}

Scene.prototype.drawBg = function () {
  this.ctx.fillStyle = this.colors.bg
  this.ctx.fillRect(0, 0, 512, 512)
}

Scene.prototype.drawTiles = function () {
  this.tileMap.layout.forEach((row, y) => {
    row.forEach((tileId, x) => {
      var tile = this.tiles[tileId]
      this._drawTile(tile.texture, { x, y }, this.colors.tile)
    })
  })
}

Scene.prototype.drawHero = function () {
  this._drawTile(this.player.texture, this.player.position, this.colors.sprite)
}

Scene.prototype.drawEventTiles = function () {
  this.eventMap.layout.forEach((row, y) => {
    row.forEach((tileId, x) => {
      var tile = this.tiles[tileId]
      this._drawTile(tile.texture, { x, y }, this.colors.sprite)
    })
  })
}

Scene.prototype.drawGrid = function () {
  var size = 32

  this.ctx.fillStyle = 'white'

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      this.ctx.fillRect(x * size, y * size, 1, 512)
      this.ctx.fillRect(x * size, y * size, 512, 1)
    }
  }
}

Scene.prototype._drawTile = function (tile, position, color) {
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

function outOfBounds (pos) {
  return pos.x < 0 || pos.y < 0 || pos.x > 15 || pos.y > 15
}

module.exports = Scene
