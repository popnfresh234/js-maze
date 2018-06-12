const maze = [];

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
  const path = [];
  const exit = getEdge(x, y);
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


module.exports = {
  buildMaze(x, y) {
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
  },
};

