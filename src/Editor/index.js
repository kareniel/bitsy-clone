var html = require('choo/html')
var Component = require('nanocomponent')
var css = require('sheetify')
var Game = require('../Game')

var tileSelector = require('./TileSelector')

css('tachyons')

function Editor () {
  if (!(this instanceof Editor)) return new Editor()

  this.game = Game()

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
      ${gameModal.call(this, state, emit)}
      
      <div class="ph2 pv3 ui w-100">
        <button class="mr3" onclick=${e => emit('play')}>play</button>
        <input id="grid-toggle" type="checkbox" checked=${state.config.grid} onchange=${e => emit('toggle-grid')} />
        <label for="grid-toggle" class="mh2 white">toggle grid</label>
      </div>
      <div class="flex flex-auto w-100 flex-row justify-between">
        <div class="ui w5 "></div>
        <div class="flex flex-auto justify-center items-center">
         
        </div>
        <div class="ui pa2">
          <p class="moon-gray">tileset</p>
          <div class="overflow-y-scroll  pr3" style="height: 512px;">
            ${tileSelector.render(state.data.tiles, emit)}
          </div>
        </div>
      </div>
      <div class="pa2 ui w-100">
      </div>
    </div>`
  return this.el
}

Editor.prototype.update = function (state, emit) {
  var changed = state.playing === this.state.playing

  this.state = state
  this.emit = emit

  this.game.render(state, emit)

  return changed
}

module.exports = Editor

function gameModal (state, emit) {
  return !state.playing ? '' : html`
    <div class="vw-100 vh-100 ba b--red flex items-center justify-center">
      <div class="fixed left-0 top-0 w-100 h-100 bg-black-90 z-4"></div>
      <button class="ma3 fixed right-0 top-0 z-4" onclick=${e => emit('play')}>x</button>
      <div class="absolute z-5">
        ${this.game.render(state.data, emit)}
      </div>
    </div>`
}
