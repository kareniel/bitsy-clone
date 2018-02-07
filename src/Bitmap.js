var randomBytes = require('randombytes')

function Bitmap (str) {
  var arr = str
    .split('\n')
    .map(row => row.split('').map(str => +str))

  return arr
}

Bitmap.empty = function (n = 8) {
  var rows = []

  Array(n).fill(0).forEach(_ => {
    var row = Array(n).fill(0).join('')
    rows.push(row)
  })

  var str = rows.join('\n')

  console.log(rows)

  return Bitmap(str)
}

Bitmap.random = function (n = 8) {
  var rows = []

  randomBytes(n).forEach(byte => {
    var row = byte.toString(2).padStart(n, '0')
    rows.push(row)
  })

  var str = rows.join('\n')

  return Bitmap(str)
}

module.exports = Bitmap
