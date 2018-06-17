function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomEncounter = {
  finished: false,
  players: [],
};

const enemy = {
  name: 'Orc',
  cpu: true,
  hp: 100,
  hpMax: 100,
  moves: [{ name: 'attack', damage: 20 }, { name: 'heal', damage: -5 }],
  cycle: 1.2,
  remaining: 1.2,
};

const player = {
  name: 'Alex',
  cpu: false,
  hp: 1000,
  hpMax: 1000,
  moves: [{ name: 'attack', damage: 15 }, { name: 'heal', damage: -10 }],
  cycle: 1.8,
  remaining: 1.8,
};

function runEncounter(playerMove) {
  let move = playerMove;
  randomEncounter.players.sort((playerA, playerB) => playerA.remaining - playerB.remaining);
  const nextPlayer = randomEncounter.players[0];
  randomEncounter.players.forEach((player) => {
    // Reduce everyone's remaining time by the next player's cycle
    player.remaining -= nextPlayer.cycle;
    // Reset cycle if
    if (player.remaining <= 0) {
      player.remaining = player.cycle;
    }
  });
  // If the next player is the CPU, run random move
  if (nextPlayer.cpu) {
    move = nextPlayer.moves[getRandomInt(0, nextPlayer.moves.length - 1)];
  }
  let target = {};
  if (move.name === 'heal') {
    target = nextPlayer;
  } else {
    target = randomEncounter.players[1];
  }
  target.hp -= move.damage;
  $('.console').append(`<p class="player-name">${nextPlayer.name} uses ${move.name}</p>`);
  $('.console').append(`<p class="status-update">${nextPlayer.name} HP=${nextPlayer.hp} ${target.name} HP=${target.hp}</p>`);
  if (target.hp <= 0) {
    if (target.cpu) {
      target.hp = target.hpMax;
    }
    randomEncounter.finished = true;
    $('.console').append(`<p>${target.name} is dead!</p>`);
    $('.console').append(`<p>Winner is ${nextPlayer.name}</p>`);
  } else if (!nextPlayer.cpu) {
    runEncounter();
  }
}


function setupEncounter() {
  randomEncounter.finished = false;
  randomEncounter.players.push(enemy, player);
  player.moves.forEach((move) => {
    $('.controls').append(`<button class="control-button" name="${move.name}">${move.name}</button>`);
  });
  runEncounter();
}

$(document).ready(() => {
  setupEncounter();
});

$(document).on('click', '.control-button', (event) => {
  if (!randomEncounter.finished) {
    const move = player.moves.filter((playerMove) => {
      if (playerMove.name === event.target.name) {
        return playerMove;
      } return false;
    })[0];
    runEncounter(move);
  } else {
    alert('DONE');
  }
});

