let whoseTurn = 1;
// 0 = O
// 1 = X
let boardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

let divConnect = {
  square0: [0, 0],
  square1: [0, 1],
  square2: [0, 2],
  square3: [1, 0],
  square4: [1, 1],
  square5: [1, 2],
  square6: [2, 0],
  square7: [2, 1],
  square8: [2, 2],
}

document.getElementById('reset').addEventListener('click', (event) => {
  console.log('clicked');
  boardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
  whoseTurn = 1;
  let squares = document.getElementsByClassName('square');
  for (square of squares) {
    square.style.backgroundImage = 'none';
  }
  console.log('new Game');
});


document.getElementById('board').addEventListener('click', (event) => {
  // console.log(event);
  // console.log(event.target);
  if (event.target.className === 'square') {
    if (whoseTurn % 2 === 0) {
      event.target.style.backgroundImage = "url('https://static.wikia.nocookie.net/rimworld-bestiary/images/7/73/MM_WillOWisp_east.png/revision/latest?cb=20190918105436')";
      // console.log('O just went');
      // console.log(boardState);
      whoseTurn++;
    } else {
      event.target.style.backgroundImage = "url('https://lh3.googleusercontent.com/proxy/QAyjktL2ozNKpx550VTmc_q0jyPwGWjfzNM8lts08HtfNQAF3r7og1LXuhiCp-Cz7oYnoigksOrVrjQEc3bLWToglISxjjOro_pEYFPuAhdCLrEOMpScmCZsNLqeCHrRUiUdfA4Al6hh-Rb5NTZt-rx2lPdMapuwfw')";
      // console.log(boardState);
      // console.log('X just went');
      whoseTurn++;
    }
  }
})

const rowChecker = (boardState) => {
  for (let i = 0; i < boardState.length; i++) {
    let row = boardState[i];
    let firstEleOfRow = row[0];
    let threeInARow = true;
    for (let j = 0; j < row.length; j++) {
      let colEle = row[j];
      if (colEle === null) {
        threeInARow = false;
        break;
      } else if (colEle !== firstEleOfRow) {
        threeInARow = false;
        break;
      }
    }
    if (threeInARow) {
      return firstEleOfRow;
    }
  }
};

const columnChecker = (boardState) => {
  // look at the same col ele of each row,
  // iterate through the rows
  for (let j = 0; j < boardState[0].length; j++) {
    let firstEleOfCol = boardState[0][j];
    let threeInARow = true;
    for (let i = 0; i < boardState.length; i++) {
      // now looking at rows of a particular position
      let rowColEle = boardState[i][j];

      if (rowColEle === null) {
        threeInARow = false;
        break;
      } else if (rowColEle !== firstEleOfCol) {
        threeInARow = false;
        break;
      }
    }
    if (threeInARow) {
      return firstEleOfCol;
    }
  }
}

const majorDiagonalChecker = (boardState) => {
  let firstDiagonalEle = boardState[0][0];
  let threeInARow = true;
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i][i] !== firstDiagonalEle) {
      threeInARow = false;
    }
  }
  if (threeInARow) {
    return firstDiagonalEle;
  }
}

const minorDiagonalChecker = (boardState) => {
  let firstDiagonalEle = boardState[boardState.length - 1][0];
  let threeInARow = true;
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[boardState.length - 1 - i][i] !== firstDiagonalEle) {
      threeInARow = false;
    }
  }
  if (threeInARow) {
    return firstDiagonalEle;
  }
}

const checkAll = (boardState) => {

  if (rowChecker(boardState)) {
    return rowChecker(boardState);
  }
  if(columnChecker(boardState)) {
    return columnChecker(boardState);
  }

  if(majorDiagonalChecker(boardState)) {
    return majorDiagonalChecker(boardState);
  }

  if(minorDiagonalChecker(boardState)) {
    return minorDiagonalChecker(boardState);
  }
  // return which party wins if one does otherwise returns undefined
}
