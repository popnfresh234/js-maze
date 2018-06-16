const game = {
  finished: false,
};

let maze = [];
const WALL_LENGTH = 50;


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getValidMoves(currentMove, x, y) {
  // maze accesed in [y][x]
  let validMoves = [];
  // up
  if (currentMove.y - 1 >= 0) {
    validMoves.push(maze[currentMove.y - 1][currentMove.x]);
  }

  // right
  if (currentMove.x + 1 <= x - 1) {
    validMoves.push(maze[currentMove.y][currentMove.x + 1]);
  }

  // down
  if (currentMove.y + 1 <= y - 1) {
    validMoves.push(maze[currentMove.y + 1][currentMove.x]);
  }

  // left
  if (currentMove.x - 1 >= 0) {
    validMoves.push(maze[currentMove.y][currentMove.x - 1]);
  }

  validMoves = validMoves.filter((move) => {
    if (move.visited) {
      return false;
    }
    return true;
  });
  return validMoves;
}

function getEdge(x, y) {
  const edge = getRandomInt(0, 3);
  const edgeMap = {
    0: () => maze[0][getRandomInt(0, x - 1)],
    1: () => maze[getRandomInt(0, y - 1)][x - 1],
    2: () => maze[y - 1][getRandomInt(0, x - 1)],
    3: () => maze[getRandomInt(0, y - 1)][0],
  };
  const fn = edgeMap[edge];
  if (fn) {
    const move = fn();
    if (move.x === 0) {
      move.walls[3] = 0;
    } else if (move.y === 0) {
      move.walls[0] = 0;
    } else if (move.x === x - 1) {
      move.walls[1] = 0;
    } else if (move.y === y - 1) {
      move.walls[2] = 0;
    }
    return move;
  } return null;
}

function populateMaze(x, y) {
  let currentMove = getEdge(x, y);
  currentMove.firstMove = true;
  currentMove.currentPosition = true;
  const path = [];
  const exit = getEdge(x, y);
  exit.lastMove = true;
  maze[exit.y][exit.x] = exit;
  currentMove.visited = true;
  path.push(currentMove);
  let i = 0;
  while (i < (x * y) - 1) {
    const validMoves = getValidMoves(currentMove, x, y);
    if (validMoves.length) {
      const nextMove = validMoves[getRandomInt(0, validMoves.length - 1)];

      // We moved up
      if (nextMove.y < currentMove.y) {
        // remove current moves top
        currentMove.walls[0] = 0;
        // remove next moves buttom
        nextMove.walls[2] = 0;
      }
      // We moved right
      if (nextMove.x > currentMove.x) {
        // remove current moves right
        currentMove.walls[1] = 0;
        // remove next moves left
        nextMove.walls[3] = 0;
      }
      // we moved down
      if (nextMove.y > currentMove.y) {
      // remove current moves bottom
        currentMove.walls[2] = 0;
        // remove next moves top
        nextMove.walls[0] = 0;
      }
      // We moved left
      if (nextMove.x < currentMove.x) {
        // remove current moves left
        currentMove.walls[3] = 0;
        // remove next moves right
        nextMove.walls[1] = 0;
      }
      i++;
      currentMove.count = i;

      maze[currentMove.y][currentMove.x] = currentMove;
      // move to new cell
      nextMove.visited = true;
      currentMove = nextMove;
      path.push(currentMove);
    } else {
      currentMove = path.pop();
    }
  }
}

function buildMaze(x, y) {
  maze = [];
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) {
      row.push({
        visited: false, x: j, y: i, walls: [1, 1, 1, 1],
      });
    }
    maze.push(row);
  }
  populateMaze(x, y);
  return maze;
}

function drawMaze(inputX, inputY) {
  // reset game
  game.finished = false;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = inputX * WALL_LENGTH;
  ctx.canvas.height = inputY * WALL_LENGTH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  buildMaze(inputX, inputY);

  // maze accessed in y,x format
  for (let y = 0; y < inputY; y++) {
    for (let x = 0; x < inputX; x++) {
      const testCell = maze[y][x];
      // Fill in square if entrance
      if (testCell.firstMove) {
        ctx.fillStyle = 'rgba(0,255,0,0.2';
        ctx.fillRect(testCell.x * WALL_LENGTH, testCell.y * WALL_LENGTH, WALL_LENGTH, WALL_LENGTH);
      }
      // Fill in exit
      if (testCell.lastMove) {
        ctx.fillStyle = 'rgba(255,0,0,0.2';
        ctx.fillRect(testCell.x * WALL_LENGTH, testCell.y * WALL_LENGTH, WALL_LENGTH, WALL_LENGTH);
      }
      // Top line for first row only
      if (testCell.walls[0] && y === 0) {
        ctx.beginPath();
        ctx.moveTo(x * WALL_LENGTH, y);
        ctx.lineTo((x * WALL_LENGTH) + WALL_LENGTH, y);
        ctx.stroke();
        ctx.closePath();
      }

      // Right wall
      if (testCell.walls[1]) {
        ctx.beginPath();
        ctx.moveTo(x * WALL_LENGTH + WALL_LENGTH, y * WALL_LENGTH);
        ctx.lineTo(x * WALL_LENGTH + WALL_LENGTH, y * WALL_LENGTH + WALL_LENGTH);
        ctx.stroke();
        ctx.closePath();
      }

      // Bottom line for all other rows
      if (testCell.walls[2]) {
        ctx.beginPath();
        ctx.moveTo(x * WALL_LENGTH, y * WALL_LENGTH + WALL_LENGTH);
        ctx.lineTo(x * WALL_LENGTH + WALL_LENGTH, y * WALL_LENGTH + WALL_LENGTH);
        ctx.stroke();
        ctx.closePath();
      }

      // Left wall
      if (testCell.walls[3]) {
        ctx.beginPath();
        ctx.moveTo(x * WALL_LENGTH, y * WALL_LENGTH);
        ctx.lineTo(x * WALL_LENGTH, y * WALL_LENGTH + WALL_LENGTH);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function getCurrentPosition() {
  let currentPosition = {};
  maze.forEach((row) => {
    row.forEach((cell) => {
      if (cell.currentPosition) {
        currentPosition = cell;
      }
    });
  });
  return currentPosition;
}

function move(dir) {
  const currentPosition = getCurrentPosition();
  const { walls } = currentPosition;
  const dirs = [0, 1, 2, 3];
  const dirMap = dirs.reduce((agg, curr) => {
    if (curr === 0 && currentPosition.y - 1 >= 0 && !walls[curr]) {
      agg[curr] = () => maze[currentPosition.y - 1][currentPosition.x];
    }
    if (curr === 1 && currentPosition.x + 1 < maze.length && !walls[curr]) {
      agg[curr] = () => maze[currentPosition.y][currentPosition.x + 1];
    }
    if (curr === 2 && currentPosition.y + 1 < maze.length && !walls[curr]) {
      agg[curr] = () => maze[currentPosition.y + 1][currentPosition.x];
    }

    if (curr === 3 && currentPosition.x - 1 >= 0 && !walls[curr]) {
      agg[curr] = () => maze[currentPosition.y][currentPosition.x - 1];
    }
    return agg;
  }, {});

  const fn = dirMap[dir];
  if (fn) {
    currentPosition.currentPosition = false;
    const newPosition = fn();
    newPosition.currentPosition = true;
    maze[newPosition.y][newPosition.x] = newPosition;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,255,0,0.2';
    ctx.fillRect(newPosition.x * WALL_LENGTH, newPosition.y * WALL_LENGTH, WALL_LENGTH, WALL_LENGTH);
    if (newPosition.lastMove) {
      newPosition.currentPosition = false;
      game.finished = true;
      alert('FINISHED');
    }
  }
}


$(document).ready(() => {
  $('#maze-input').submit((ev) => {
    ev.preventDefault();
    const mazex = $('#mazex').val();
    const mazey = $('#mazey').val();
    if (mazex && mazey) {
      drawMaze(mazex, mazey);
    }
  });

  $(document).keydown((event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      if (game.finished) {
        alert('Game complete, generate new maze');
      } else {
        const keyMap = {
          ArrowUp: () => move(0),
          ArrowRight: () => move(1),
          ArrowDown: () => move(2),
          ArrowLeft: () => move(3),
        };

        const fn = keyMap[event.key];
        if (fn) {
          fn();
        }
      }
    }
  });
});
