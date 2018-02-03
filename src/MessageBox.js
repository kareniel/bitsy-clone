var nanobus = require('nanobus')
var Bitmap = require('./Bitmap')

function MessageBox (ctx, msg) {
  if (!(this instanceof MessageBox)) return new MessageBox(ctx, msg)

  nanobus.call(this)

  this.ctx = ctx
  this.rendering = true
  this.message = msg
  this.letters = []
  this.closed = false

  this.draw()
}

MessageBox.prototype = Object.create(nanobus.prototype)

MessageBox.prototype.draw = function () {
  if (this.closed) return

  this._drawBg()

  if (this.letters.length === this.message.length) {
    this.rendering = false
    this._drawLetters()
    this._drawCursor()
    return
  }

  this.letters.push(this.message[this.letters.length])
  this._drawLetters()

  var timer = setTimeout(() => {
    clearTimeout(timer)
    this.draw()
  }, 100)
}

MessageBox.prototype.handleKeyDown = function () {
  if (this.rendering) {
    this.letters = this.message.split('')
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
  // max char length 31 & 28
  // lines are 24px appart

  this.ctx.fillStyle = 'white'
  this.ctx.font = 'normal 400 16px msx'
  this.ctx.imageSmoothingEnabled = false
  this.ctx.fillText(this.letters.join(''), 68, 78)
}
MessageBox.prototype._drawCursor = function () {
  this.ctx.fillStyle = 'white'

  var sprite = Bitmap('11111\n01110\n00100')

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
