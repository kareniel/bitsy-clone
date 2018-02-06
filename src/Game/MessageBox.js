var nanobus = require('nanobus')
var Bitmap = require('../Bitmap')
const MS_PER_LETTER = 100
const POSITIONS = ['top', 'center', 'bottom']
const DEFAULT_CURSOR = '11111\n01110\n00100'
const DEFAULT_FONT = 'normal 400 16px msx'

function MessageBox (ctx) {
  if (!(this instanceof MessageBox)) return new MessageBox(ctx)

  nanobus.call(this)

  this.ctx = ctx

  this.text = ''
  this.letters = []
  this.visible = true
  this.rendering = true
  this.position = POSITIONS[0]
  this.speed = MS_PER_LETTER
}

MessageBox.prototype = Object.create(nanobus.prototype)

MessageBox.prototype.dialog = function (text) {
  this.text = text
  this.letters = []
  this.draw()
}

MessageBox.prototype.draw = function () {
  if (!this.visible) return

  this._drawBg()

  // finish rendering, show cursor
  if (this.letters.length === this.text.length) {
    this.rendering = false
    this._drawLetters()
    this._drawCursor()
    return
  }

  // draw the next letter
  this.letters.push(this.text[this.letters.length])
  this._drawLetters()

  // wait s seconds and draw the next letter
  var timer = setTimeout(() => {
    clearTimeout(timer)
    this.draw()
  }, this.speed)
}

MessageBox.prototype.handleKeyDown = function () {
  if (this.rendering) {
    this.letters = this.text.split('')
  } else {
    this.closed = true
    this.emit('close')
  }
}

MessageBox.prototype._drawBg = function () {
  this.ctx.fillStyle = 'black'
  this.ctx.fillRect(48, 48, 416, 76)
}

MessageBox.prototype._drawLetters = function () {
  var text = this.letters.join('')
  var line1 = text.slice(0, 31)
  var line2 = text.slice(31, 28)

  this.ctx.fillStyle = 'white'
  this.ctx.font = DEFAULT_FONT
  this.ctx.imageSmoothingEnabled = false

  this.ctx.fillText(line1, 68, 78)
  this.ctx.fillText(line2, 68, 78 + 24)
}

MessageBox.prototype._drawCursor = function () {
  this.ctx.fillStyle = 'white'

  var sprite = Bitmap(DEFAULT_CURSOR)

  sprite.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        var x = 428 + (colIndex * 4)
        var y = 102 + (rowIndex * 4)

        this.ctx.fillRect(x, y, 4, 4)
      }
    })
  })
}

module.exports = MessageBox
