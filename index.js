var choo = require('choo')
var html = require('choo/html')

var data = require('./game-data')
var game = require('./src/Game')
var editor = require('./src/Editor')

var app = choo()

app.use(store)
app.route('*', function main (state, emit) {
  editor.game = game
  return html`
    <body>
      ${editor.render(state, emit)}
    </body>`
})

app.mount('body')

function store (state, emitter) {
  state.tiles = data.tiles
  state.gameEvents = data.gameEvents
  state.scenes = data.scenes
  state.player = data.player
  state.config = {
    grid: true
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('toggle-grid', () => {
      state.config.grid = !state.config.grid
      emitter.emit('render')
    })
  })
}
