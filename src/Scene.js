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

Scene.prototype.collides = function (vector) {
  if (this._outOfBounds(vector)) return true

  var tileId = this.tileMap.layout[vector.y][vector.x]
  var eventId = this.eventMap.layout[vector.y][vector.x]
  var tile = this.tiles[tileId]
  var event = this.gameEvents[eventId]

  if (event.type && event.payload) {
    this.emit(event.type, event.payload)
  }

  return tile.blocking || event.blocking
}

Scene.prototype._outOfBounds = function (vector) {
  return vector.x < 0 || vector.y < 0 || vector.x > 15 || vector.y > 15
}

Scene.prototype.render = function (ctx) {
  this.ctx = ctx

  this.drawBg()
  this.drawTiles()
  this.drawHero()
  this.drawEventTiles()
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
    row.forEach((eventId, x) => {
      var tile = this.gameEvents[eventId]
      if (tile.texture) this._drawTile(tile.texture, { x, y }, this.colors.sprite)
    })
  })
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

module.exports = Scene
