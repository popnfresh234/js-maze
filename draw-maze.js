
const createMaze = require('./create-maze');

const builtMaze = createMaze.buildMaze(10, 10);
builtMaze.forEach((mazeRow, index) => {
  let topRow = '';
  let middleRow = '';
  let bottomRow = '';
  // draw top row
  mazeRow.forEach((cell) => {
    // build top row
    cell.walls[0] === 1 ? topRow += '####' : topRow += '#  #';

    // build middle row
    if (cell.walls[3] === 1 && cell.walls[1] === 0) {
      // right opening only
      middleRow += '#   ';
    }

    if (cell.walls[3] === 0 && cell.walls[1] === 1) {
      // left open only
      middleRow += '   #';
    }

    if (cell.walls[3] === 0 && cell.walls[1] === 0) {
      // both ends open
      middleRow += '    ';
    }

    if (cell.walls[3] === 1 && cell.walls[1] === 1) {
      middleRow += '#  #';
    }

    // build bottom row
    cell.walls[2] === 1 ? bottomRow += '####' : bottomRow += '#  #';
  });

  if (index === 0) {
    console.log(topRow);
  }
  console.log(middleRow);
  console.log(bottomRow);
});

