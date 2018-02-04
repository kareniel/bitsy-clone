var Bitmap = require('./src/Bitmap')

var textures = require('./data/textures')
var layouts = require('./data/layouts')

module.exports = {
  config: {
    grid: false
  },
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
    type: 'message',
    payload: 'The cat purrs.'
  }, {
    id: 'to-room-2',
    type: 'teleport',
    payload: '01\n1110\n11',
    blocking: true
  }, {
    id: 'to-room-1',
    type: 'teleport',
    payload: '00\n01\n11',
    blocking: true
  }, {
    id: 'the-end',
    texture: Bitmap(textures.x),
    type: 'ending',
    payload: 'The end.',
    blocking: true
  }],
  player: {
    texture: Bitmap(textures.hero),
    position: {
      x: 4,
      y: 4
    }
  },
  scenes: [{
    colors: {
      bg: '#0052cc',
      tile: '#809fff',
      sprite: 'white'
    },
    tileMap: {
      layout: Bitmap(layouts.room1.tiles)
    },
    eventMap: {
      layout: Bitmap(layouts.room1.events)
    }
  }, {
    colors: {
      bg: '#0052cc',
      tile: '#809fff',
      sprite: 'white'
    },
    tileMap: {
      layout: Bitmap(layouts.room2.tiles)
    },
    eventMap: {
      layout: Bitmap(layouts.room2.events)
    }
  }]
}
