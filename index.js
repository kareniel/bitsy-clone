var choo = require('choo')
var html = require('choo/html')
var game = require('./Game')()
var app = choo()

app.use(store)
app.route('/', mainView)
app.mount('body')

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {

  })
}

function mainView (state, emit) {
  return html`
    <body>
      ${game.render(state, emit)}
    </body>
  `
}
