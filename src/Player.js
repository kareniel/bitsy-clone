function Player (scene, vector) {
  if (!(this instanceof Player)) return new Player(scene, vector)

  this.scene = scene
  this.position = vector
  console.log(this)
}

Player.prototype.move = function (vector) {
  console.log(vector)
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

Player.prototype.teleport = function (scene, vector) {
  this.scene = scene
  this._move(vector)
}

Player.prototype._collides = function (vector) {
  return this.scene.collides(vector)
}

module.exports = Player
