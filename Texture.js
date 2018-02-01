var randomBytes = require('randombytes')

function Texture (textureMap) {
  var arr = textureMap
    .split('\n')
    .map(row => row.split('').map(str => +str))

  return arr
}

Texture.random = function (n = 8) {
  var rows = []

  randomBytes(n).forEach(byte => {
    var row = byte.toString(2).padStart(n, '0')
    rows.push(row)
  })

  var str = rows.join('\n')

  console.log(str)

  return Texture(str)
}

module.exports = Texture
