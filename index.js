var choo = require('choo')
var html = require('choo/html')

var data = require('./game-data')
var editor = require('./src/Editor')()

var app = choo()

app.use(store)
app.route('*', function main (state, emit) {
  return html`
    <body>
      ${editor.render(state, emit)}
    </body>`
})

app.mount('body')

function store (state, emitter) {
  state.selectedTile = 0
  state.data = data
  state.playing = false
  state.config = {
    grid: true
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('toggle-grid', () => {
      state.config.grid = !state.config.grid
      emitter.emit('render')
    })

    emitter.on('play', () => {
      state.playing = !state.playing
      emitter.emit('render')
    })

    emitter.on('select-tile', index => {
      state.selectedTile = index
      emitter.emit('render')
    })
  })
}
