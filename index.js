var choo = require('choo')
var html = require('choo/html')

var data = require('./game-data')
var game = require('./src/Game')

var app = choo()

app.use(store)
app.route('*', function main (state, emit) {
  return html`
    <body>
      ${game.render(state, emit)}
    </body>`
})

app.mount('body')

function store (state, emitter) {
  state.tiles = data.tiles
  state.gameEvents = data.gameEvents
  state.scenes = data.scenes
  state.player = data.player
  state.config = data.config
}
