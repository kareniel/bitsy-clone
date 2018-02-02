var choo = require('choo')
var html = require('choo/html')

var game = require('./Game')

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
  var data = require('./game-data')

  state.tiles = data.tiles
  state.gameEvents = data.gameEvents
  state.scene = data.scene
  state.player = data.player
}
