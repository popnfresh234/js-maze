function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function randomEncounter(enemy, player) {
  const randomEncounter = {
    finished: false,
    players: [],
  };

  randomEncounter.players.push(enemy, player);
  randomEncounter.currentPlayer = randomEncounter.players[0];

  while (!randomEncounter.finished) {
    // Sort players by time remaining to find who goes next
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
    // Get a random move from the next player
    const move = nextPlayer.moves[getRandomInt(0, nextPlayer.moves.length - 1)];

    let target = {};
    if (move.name === 'heal') {
      target = nextPlayer;
    } else {
      target = randomEncounter.players[1];
    }
    target.hp -= move.damage;
    console.log(`${nextPlayer.name} uses ${move.name}`);
    if (target.hp <= 0) {
      if (target.cpu) {
        target.hp = target.hpMax;
      }
      randomEncounter.finished = true;
      console.log(`${target.name} is dead!`);
      console.log(`Winner is ${nextPlayer.name}`);
    }
  }
}

randomEncounter(enemy, player);
console.log(player);
