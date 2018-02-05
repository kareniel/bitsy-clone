var html = require('choo/html')
var Component = require('nanocomponent')
var css = require('sheetify')

var tileSelector = require('./TileSelector')

css('tachyons')

function Editor (game) {
  if (!(this instanceof Editor)) return new Editor(game)

  this.game = game

  Component.call(this)
}

Editor.prototype = Object.create(Component.prototype)

Editor.prototype.createElement = function (state, emit) {
  this.state = state
  this.emit = emit

  var prefix = css`
    body { font-family: sans-serif }
    *:focus { outline: 2px solid #2E343B; }
    :host { background-color: #4B5055; }

    .ui {
      background-color: #445157;
      border: 1px solid #15181D;
      z-index: 3;
    }`

  this.el = html`
    <div class="${prefix} flex flex-column w-100 min-vh-100 justify-between items-center">
      <div class="ph2 pv3 ui w-100">
        <input id="grid-toggle" type="checkbox" checked=${state.config.grid} onchange=${e => emit('toggle-grid')} />
        <label for="grid-toggle" class="mh2 white">toggle grid</label>
      </div>
      <div class="flex flex-auto w-100 flex-row justify-between">
        <div class="ui w5 "></div>
        <div class="flex flex-auto justify-center items-center">
          ${this.game.render(state, emit)}
        </div>
        <div class="ui pa2">
          <p class="moon-gray">tileset</p>
          <div class="overflow-y-scroll  pr3" style="height: 512px;">
            ${tileSelector.render(state.tiles, emit)}
          </div>
        </div>
      </div>
      <div class="pa2 ui w-100">
      </div>
    </div>`
  return this.el
}

Editor.prototype.update = function (state, emit) {
  this.state = state
  this.emit = emit

  this.game.render(state, emit)

  return false
}

module.exports = Editor()
