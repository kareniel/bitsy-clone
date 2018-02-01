var { scene, floor, wall } = require('./textures')
var Texture = require('./Texture')

function Scene () {
  if (!(this instanceof Scene)) return new Scene()

  this.tiles = [{
    id: 'floor',
    texture: Texture(floor),
    blocking: false
  }, {
    id: 'wall',
    texture: Texture(wall),
    blocking: true
  }]

  this.tileMap = Texture(scene)
}

Scene.prototype.collision = function (pos) {
  if (outOfBounds(pos)) return true

  var tileId = this.tileMap[pos.y][pos.x]

  return this.tiles[tileId]['blocking']
}

function outOfBounds (pos) {
  return pos.x < 0 || pos.y < 0 || pos.x > 15 || pos.y > 15
}

module.exports = Scene
