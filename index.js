// Conway's Game of Life
// use: node index.js <height> <width> <tickSpeed> <symbol> -g
// -g activates the grid, which isn't very size friendly
// example: node index.js 200 200 90 .

let height = process.argv[2] || 10
let width = process.argv[3] || 10
let tickSpeed = process.argv[4] || 2000
let symbol = process.argv[5] || 'X'
let gridActive = false
let created = false

if (process.argv[6] == '-g') {
  gridActive = true
}

let Tile = function(x, y) {
  this.x = x
  this.y = y
  this.liveNeighbors = 0
  this.alive = false
}

Tile.prototype.randomLife = function() {
  if (randomRange(0, 1) == 1) {
    this.alive = true
  }
}

Tile.prototype.tick = function() {
  this.liveNeighbors = 0
  // N
  if (isTileAlive(this.y - 1, this.x)) {
    this.liveNeighbors++
  }
  // NE
  if (isTileAlive(this.y - 1, this.x + 1)) {
    this.liveNeighbors++
  }
  // E
  if (isTileAlive(this.y, this.x + 1)) {
    this.liveNeighbors++
  }
  // SE
  if (isTileAlive(this.y + 1, this.x + 1)) {
    this.liveNeighbors++
  }
  // S
  if (isTileAlive(this.y + 1, this.x)) {
    this.liveNeighbors++
  }
  // SW
  if (isTileAlive(this.y + 1, this.x - 1)) {
    this.liveNeighbors++
  }
  // W
  if (isTileAlive(this.y, this.x - 1)) {
    this.liveNeighbors++
  }
  // NW
  if (isTileAlive(this.y - 1, this.x - 1)) {
    this.liveNeighbors++
  }

  if (this.alive && this.liveNeighbors < 2) {
    this.alive = false
  } else if (this.alive && this.liveNeighbors > 3) {
    this.alive = false
  } else if (!this.alive && this.liveNeighbors == 3) {
    this.alive = true
  }
}

let isTileAlive = function(y, x) {
  if (y >= 0 && y <= width - 1 && x >= 0 && x <= height - 1 && gameBoard[y][x] !== undefined && gameBoard[y][x].alive) {
    return true
  } else {
    return false
  }
}

let randomRange = function(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

let deadSpace = ''
let aliveSpace = ''

if (gridActive) {
  deadSpace = '|   |'
  aliveSpace = '| ' + symbol + ' |'
} else {
  deadSpace = ' '
  aliveSpace = symbol
}

let gameBoard = []

let CreateBoard = function() {
  let board = ''
  if (gridActive) {
    let top = ''
    for (var i = 0; i < width; i++) {
      top += '_____'
    }
    console.log(top)
  }
  for (var y = 0; y < height; y++) {
    if (!created) {
      gameBoard[y] = []
    }
    for (var x = 0; x < width; x++) {
      if (!created) {
        let newTile = new Tile(x, y)
        newTile.randomLife()
        gameBoard[y][x] = newTile
        if (newTile.alive) {
          board += aliveSpace
        } else {
          board += deadSpace
        }
      } else {
        if (gameBoard[y][x].alive) {
          board += aliveSpace
        } else {
          board += deadSpace
        }
      }
    }
    console.log(board)
    if (gridActive) {
      let edge = ''
      for (var i = 0; i < width; i++) {
        edge += '_____'
      }
      console.log(edge)
    }
    board = ''
  }
  if (!created) {
    created = true
  }
}

let tick = function() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      gameBoard[y][x].tick()
    }
  }
}

console.reset = function() {
  return process.stdout.write('\033c')
}

CreateBoard()

let updateBoard = function() {
  console.reset()
  tick()
  CreateBoard()
}

setInterval(function() {
  updateBoard()
}, tickSpeed);
