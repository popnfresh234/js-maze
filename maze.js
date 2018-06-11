const maze = [];

function getValidMoves(position, x, y) {
  // position is [x, y]
  let validMoves = [];
  const up = { dir: 'U', pos: [position[0], position[1] - 1] };
  const right = { dir: 'R', pos: [position[0] + 1, position[1]] };
  const down = { dir: 'D', pos: [position[0], position[1] + 1] };
  const left = { dir: 'L', pos: [position[0] - 1, position[1]] };
  validMoves.push(up, right, down, left);
  validMoves = validMoves.filter((move) => {
    if (move.pos[0] < 0 || move.pos[0] > x - 1 || move.pos[1] < 0 || move.pos[1] > y - 1) {
      return false;
    }

    if (maze[move.pos[1]] && maze[move.pos[1]][move.pos[0]]) {
      return false;
    }

    return true;
  });
  return validMoves;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function populateMaze(x, y) {
  let currentPos = [1, 4];
  const path = [];
  // Maze coords accesed in [y][x]
  maze[currentPos[1]][currentPos[0]] = 'S';
  let i = 0;
  while (i < (x * y) - 1) {
    const validMoves = getValidMoves(currentPos, x, y);
    if (validMoves.length) {
      const random = getRandomInt(0, validMoves.length - 1);
      const move = validMoves[random];
      currentPos = move.pos;
      path.push(currentPos);
      maze[currentPos[1]][currentPos[0]] = i + move.dir;
      i++;
    } else {
      console.log('pop');
      currentPos = path.pop();
    }
  }
}

function buildMaze(x, y) {
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) {
      row.push(0);
    }
    maze.push(row);
  }
  populateMaze(x, y);
  return maze;
}

console.log(buildMaze(10, 10));
