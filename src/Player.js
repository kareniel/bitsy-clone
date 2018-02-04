function Player (texture) {
  if (!(this instanceof Player)) return new Player(texture)

  this.position = {}
  this.texture = texture
}

Player.prototype.move = function (vector) {
  var nextPosition = {
    x: this.position.x + vector.x,
    y: this.position.y + vector.y
  }

  if (!this._collides(nextPosition)) {
    this._move(nextPosition)
  }
}

Player.prototype._move = function (position) {
  this.position.x = position.x
  this.position.y = position.y
}

Player.prototype.teleport = function (vector, scene) {
  if (scene) this.scene = scene
  this._move(vector)
}

Player.prototype._collides = function (vector) {
  return this.scene.collides(vector)
}

module.exports = Player
