const game = {
  finished: false,
  battle: false,
};

const randomEncounter = {
  finished: false,
  combatants: [],
};

const enemy = {
  name: 'Orc',
  cpu: true,
  hp: 100,
  hpMax: 100,
  moves: [{ name: 'attack', damage: 20 }, { name: 'heal', damage: -5 }],
  cycle: 2.6,
  remaining: 2.6,
};

const player = {
  name: 'Alex',
  cpu: false,
  hp: 1000,
  hpMax: 1000,
  moves: [{ name: 'attack', damage: 15 }, { name: 'heal', damage: -10 }, { name: 'cower', damage: -1 }],
  cycle: 1.8,
  remaining: 1.8,
};


let maze = [];
const WALL_LENGTH = 50;

function updateStats() {
  $('.player-status').replaceWith(`<div class="player-status"><p>${player.name} HP: ${player.hp}</p></div>`);
  $('.cpu-status').replaceWith(`<div class="cpu-status"><p>${enemy.name} HP: ${enemy.hp}</p></div>`);
}

function runEncounter(playerMove) {
  let action = playerMove;
  randomEncounter.combatants.sort((playerA, playerB) => playerA.remaining - playerB.remaining);
  const nextPlayer = randomEncounter.combatants[0];
  randomEncounter.combatants.forEach((combatant) => {
    // Reduce everyone's remaining time by the next player's cycle
    combatant.remaining -= nextPlayer.cycle;
    // Reset cycle if
    if (combatant.remaining <= 0) {
      combatant.remaining = combatant.cycle;
    }
  });
  // If the next player is the CPU, run random move
  if (nextPlayer.cpu) {
    action = nextPlayer.moves[getRandomInt(0, nextPlayer.moves.length - 1)];
  }
  let target = randomEncounter.combatants[1];
  const selfMap = {
    heal: () => nextPlayer,
    cower: () => nextPlayer,
  };
  const selfFn = selfMap[action.name];
  if (selfFn) {
    target = selfFn();
  }
  target.hp - action.damage > target.hpMax
    ? target.hp = target.hpMax
    : target.hp = Math.max(0, target.hp - action.damage);
  $('.console').append(`<p class="player-name">${nextPlayer.name} uses ${action.name}</p>`);
  updateStats();
  if (target.hp === 0) {
    if (target.cpu) {
      target.hp = target.hpMax;
    } else {
      // player is dead
      game.finished = !game.finished;
    }
    randomEncounter.finished = true;
    $('.console').append(`<p>${target.name} is dead!</p>`);
    $('.console').append(`<p>Winner is ${nextPlayer.name}</p>`);
    // reset cycles
    randomEncounter.combatants.forEach((combatant) => {
      combatant.remaining = combatant.cycle;
    });
    // end battle
    game.battle = !game.battle;
    // Clear out controls and status
    $('.controls').empty();
    $('.cpu-status').empty();
  } else if (!nextPlayer.cpu) {
    runEncounter();
  }
  $('.console').scrollTop($('.console')[0].scrollHeight);
}

function setupEncounter() {
  game.battle = !game.battle;
  updateStats();
  randomEncounter.finished = false;
  player.moves.forEach((action) => {
    $('.controls').append(`<button class="control-button" name="${action.name}">${action.name}</button>`);
  });
  randomEncounter.combatants.sort((playerA, playerB) => playerA.remaining - playerB.remaining);
  if (randomEncounter.combatants[0].cpu) {
    runEncounter();
  }
}

$(document).on('click', '.control-button', (event) => {
  if (!randomEncounter.finished) {
    const action = player.moves.filter((playerMove) => {
      if (playerMove.name === event.target.name) {
        return playerMove;
      } return false;
    })[0];
    runEncounter(action);
  } else {
    alert('Battle complete');
  }
});

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
    ctx.fillRect(newPosition.x * WALL_LENGTH + 1, newPosition.y * WALL_LENGTH + 1, WALL_LENGTH - 1, WALL_LENGTH - 1);
    if (newPosition.lastMove) {
      newPosition.currentPosition = false;
      game.finished = true;
      alert('FINISHED');
    } else if (getRandomInt(0, 5) === 5) {
      setupEncounter();
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
    // Set up combatants
    randomEncounter.combatants = [];
    randomEncounter.combatants.push(enemy, player);
    randomEncounter.combatants.forEach((combatant) => {
      combatant.hp = combatant.hpMax;
    });
    // clear console
    $('.console').empty();
  });

  $(document).keydown((event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      if (game.finished) {
        alert('Game complete, generate new maze');
      } else if (game.battle) {
        alert('Battle in progress');
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
