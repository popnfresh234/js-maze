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

function populateMaze(x, y) {
  let currentMove = maze[0][0];
  const path = [];

  currentMove.visited = true;
  currentMove.walls[3] = 0;
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
      if (i === (x * y) - 1) {
        nextMove.lastMove = true;
      }
      currentMove = nextMove;
      path.push(currentMove);
    } else {
      currentMove = path.pop();
    }
  }
}


function buildMaze(x, y) {
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


const builtMaze = buildMaze(20, 20);

builtMaze.forEach((mazeRow, index) => {
  let topRow = '';
  let middleRow = '';
  let bottomRow = '';
  // draw top row
  mazeRow.forEach((cell) => {
    // build top row
    cell.walls[0] === 1 ? topRow += '@@@' : topRow += '@ @';

    // build middle row
    if (cell.walls[3] === 1 && cell.walls[1] === 0) {
      // right opening only
      middleRow += '@  ';
    }

    if (cell.walls[3] === 0 && cell.walls[1] === 1) {
    // left open only
      middleRow += '  @';
    }

    if (cell.walls[3] === 0 && cell.walls[1] === 0) {
      // both ends open
      middleRow += '   ';
    }

    if (cell.walls[3] === 1 && cell.walls[1] === 1) {
      middleRow += '@ @';
    }

    if (cell.lastMove) {
      middleRow = `${middleRow.substr(0, middleRow.length - 2)}*${middleRow.substr(middleRow.length - 1)}`;
    }

    // build bottom row
    cell.walls[2] === 1 ? bottomRow += '@@@' : bottomRow += '@ @';
  });

  if (index === 0) {
    console.log(topRow);
  }
  console.log(middleRow);
  console.log(bottomRow);
});
