var Bitmap = require('./src/Bitmap')

var textures = require('./data/textures')
var layouts = require('./data/layouts')

module.exports = {
  tiles: [{
    texture: Bitmap.empty()
  }, {
    id: 'wall',
    texture: Bitmap(textures.wall),
    blocking: true
  }],
  gameEvents: [{
    texture: Bitmap.empty()
  }, {
    id: 'cat',
    texture: Bitmap(textures.cat),
    blocking: true,
    interact: function () {
      this.emit('message', 'The cat purrs.')
    }
  }],
  player: {
    texture: Bitmap(textures.hero),
    position: {
      x: 4,
      y: 4
    }
  },
  scene: {
    colors: {
      bg: '#0052cc',
      tile: '#809fff',
      sprite: 'white'
    },
    tileMap: {
      id: 'default',
      layout: Bitmap(layouts.default.tiles)
    },
    eventMap: {
      id: 'default',
      layout: Bitmap(layouts.default.events)
    }
  }
}
