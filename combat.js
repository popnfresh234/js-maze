function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

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
  moves: [{ name: 'attack', damage: 15 }, { name: 'heal', damage: -10 }],
  cycle: 1.8,
  remaining: 1.8,
};

function updateStats() {
  $('.player-status').replaceWith(`<div class="player-status"><p>${player.name} HP: ${player.hp}</p></div>`);
  $('.cpu-status').replaceWith(`<div class="cpu-status"><p>${enemy.name} HP: ${enemy.hp}</p></div>`);
}

function runEncounter(playerMove) {
  let move = playerMove;
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
    move = nextPlayer.moves[getRandomInt(0, nextPlayer.moves.length - 1)];
  }
  let target = randomEncounter.combatants[1];
  const selfMap = {
    heal: () => nextPlayer,
  };
  const selfFn = selfMap[move.name];
  if (selfFn) {
    target = selfFn();
  }
  target.hp - move.damage > target.hpMax
    ? target.hp = target.hpMax
    : target.hp = Math.max(0, target.hp - move.damage);
  $('.console').append(`<p class="player-name">${nextPlayer.name} uses ${move.name}</p>`);
  updateStats();
  if (target.hp === 0) {
    if (target.cpu) {
      target.hp = target.hpMax;
    }
    randomEncounter.finished = true;
    $('.console').append(`<p>${target.name} is dead!</p>`);
    $('.console').append(`<p>Winner is ${nextPlayer.name}</p>`);
  } else if (!nextPlayer.cpu) {
    runEncounter();
  }
  $('.console').scrollTop($('.console')[0].scrollHeight);
}


function setupEncounter() {
  updateStats();
  randomEncounter.finished = false;
  randomEncounter.combatants.push(enemy, player);
  player.moves.forEach((move) => {
    $('.controls').append(`<button class="control-button" name="${move.name}">${move.name}</button>`);
  });
  randomEncounter.combatants.sort((playerA, playerB) => playerA.remaining - playerB.remaining);
  if (randomEncounter.combatants[0].cpu) {
    runEncounter();
  }
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

