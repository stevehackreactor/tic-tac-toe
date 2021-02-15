// State Management =============================================
let state = {};

state.whoseTurn = 1;
// 0 = O
// 1 = X
state.boardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

state.divConnect = {
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

state.gameOver = false;

state.lastWinner = 'O';
state.xWins = 0;
state.oWins = 0;



// Event Handlers =============================================

document.getElementById('reset').addEventListener('click', (event) => {
  // console.log('clicked');
  state.boardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
  if (state.lastWinner === 'O') {
    state.whoseTurn = 1;
  } else {
    state.whoseTurn = 0;
  }
  viewFunctions.renderNewBoard();

  state.gameOver = false;
  console.log('new Game');
});


document.getElementById('board').addEventListener('click', (event) => {
  // console.log(event);
  // console.log(event.target);
  if (state.gameOver === true) {
    return;
  }

  let dataCoordinates = state.divConnect[event.target.id]
  let yPos = dataCoordinates[0];
  let xPos = dataCoordinates[1];

  if (state.boardState[yPos][xPos] !== null) {
    console.log('select a different square');
    return;
  }

  if (event.target.className === 'square') {
    // console.log(event.target.id);
    if (state.whoseTurn % 2 === 0) {
      viewFunctions.renderO(event);
      resolveTurn(yPos, xPos, 'O');
    } else {
      viewFunctions.renderX(event);
      resolveTurn(yPos, xPos, 'X');
    }
  }
})

// rendering view funcs =============================================

let viewFunctions = {};

viewFunctions.renderX = (event) => {
  event.target.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNUOdtMq8p0P87h6rsG168Ecbph7jS_hneRg&usqp=CAU')"; // image for x
}

viewFunctions.renderO = (event) => {
  event.target.style.backgroundImage = "url('https://static.wikia.nocookie.net/rimworld-bestiary/images/7/73/MM_WillOWisp_east.png/revision/latest?cb=20190918105436')"; // image for O
}

viewFunctions.renderNewBoard = () => {
  let squares = document.getElementsByClassName('square');
  for (square of squares) {
    square.style.backgroundImage = 'none';
  }
}
// resolve turn logic =============================================

// post click handler
const resolveTurn = (yPos, xPos, turnStr) => {
  state.boardState[yPos][xPos] = turnStr;
  let winner = checkAll(state.boardState);
  if (winner) {
    alert(`${winner} Wins!!!`)
    state.gameOver = true;
    state.lastWinner = winner;
    document.getElementById('winner').innerHTML = `${winner} wins, they will go second next round`;
    if (winner === 'X') {
      state.xWins++;
    } else {
      state.oWins++;
    }
    document.getElementById('score').innerHTML = `O has ${state.oWins} wins<br>X has ${state.xWins} wins`;
  } else {
    state.whoseTurn++;
  }
}


// 3 in a row logic =============================================

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
