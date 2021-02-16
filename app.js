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

state.xName = 'X';
state.oName = 'O';

state.hardMode = true;




// Event Handlers =============================================

document.getElementById('reset').addEventListener('click', (event) => {
  pageActions.resetClick(event);
});

document.getElementById('board').addEventListener('click', (event) => {
  pageActions.boardClick(event);
});

document.getElementById('oNameSubmit').addEventListener('click', (event) => {
  pageActions.changeOName(event);
});

document.getElementById('xNameSubmit').addEventListener('click', (event) => {
  pageActions.changeXName(event);
});

document.getElementById('hardmode').addEventListener('click', (event) => {
  pageActions.toggleHardMode(event);
});

// page event funcs =============================================

let pageActions = {};

pageActions.toggleHardMode = (event) => {
  event.preventDefault();
  state.hardMode = (!state.hardMode);
  console.log('HARDMODE ', state.hardMode);
  if (state.hardMode) {
    document.getElementById('hardmode').innerHTML = 'HardMode On';
  } else {
    document.getElementById('hardmode').innerHTML = 'HardMode Off';
  }
}

pageActions.changeOName = (event) => {
  event.preventDefault();
  state.oName = document.getElementById('oNameChange').value;
  document.getElementById('oNameChange').value = '';
  viewFunctions.updateScores();
}

pageActions.changeXName = (event) => {
  event.preventDefault();
  state.xName = document.getElementById('xNameChange').value;
  document.getElementById('xNameChange').value = '';
  viewFunctions.updateScores();
}

pageActions.boardClick = (event) => {
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
      // viewFunctions.renderO(event);
      resolveTurn(yPos, xPos, 'O');
    } else {
      // viewFunctions.renderX(event);
      resolveTurn(yPos, xPos, 'X');
    }
  }
}

pageActions.resetClick = (event) => {
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
  document.body.style.backgroundImage = "none";
}

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

viewFunctions.updateWinner = (winner) => {
  document.getElementById('winner').innerHTML = `${winner} wins, they will go second next round`;
}

viewFunctions.updateScores = () => {
  document.getElementById('score').innerHTML = `${state.oName} has ${state.oWins} wins<img src="https://static.wikia.nocookie.net/rimworld-bestiary/images/7/73/MM_WillOWisp_east.png/revision/latest?cb=20190918105436" width="100" height="100"><br><br><br><br><br><br>${state.xName} has ${state.xWins} wins<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNUOdtMq8p0P87h6rsG168Ecbph7jS_hneRg&usqp=CAU" width="100" height="100">`;
}

viewFunctions.reRenderBoard = () => {
  let squareLoc = 0;

  for (let i = 0; i < state.boardState.length; i++) {
    for (let j = 0; j < state.boardState.length; j++) {
      if (state.boardState[i][j] === null) {
        document.getElementById(`square${squareLoc}`).style.backgroundImage = "none";
      } else if (state.boardState[i][j] === 'X') {
        document.getElementById(`square${squareLoc}`).style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNUOdtMq8p0P87h6rsG168Ecbph7jS_hneRg&usqp=CAU')";
      } else {
        document.getElementById(`square${squareLoc}`).style.backgroundImage = "url('https://static.wikia.nocookie.net/rimworld-bestiary/images/7/73/MM_WillOWisp_east.png/revision/latest?cb=20190918105436')";
      }
      squareLoc++;
    }
  }
}

// resolve turn logic =============================================

// post click handler
const resolveTurn = (yPos, xPos, turnStr) => {
  state.boardState[yPos][xPos] = turnStr;

  if (state.hardMode) {
    state.boardState = applyGravityAll(state.boardState);
    boardRotation();
  }
  viewFunctions.reRenderBoard();
  let winner = checkAll(state.boardState);
  if (winner) {
    // alert(`${winner} Wins!!!`)
    document.body.style.backgroundImage = "url('https://media.giphy.com/media/1ofR3QioNy264/giphy.gif')";

    setTimeout(() => {
      document.body.style.backgroundImage = "none";
    }, 2000);
    state.gameOver = true;
    state.lastWinner = winner;
    if (winner === 'X') {
      var winnerName = state.xName;
    } else {
      var winnerName = state.oName;
    }
    viewFunctions.updateWinner(winnerName);
    if (winner === 'X') {
      state.xWins++;
    } else {
      state.oWins++;
    }
    viewFunctions.updateScores();
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

// board rotation logic =============================================


const boardRotation = () => {
  let newState = [];

  for (let i = 0; i < state.boardState.length; i++) {
    let newRow = [];
    let col = i;
    // i will indicate which column
    for (let j = 0; j < state.boardState.length; j++) {
      // j will indicate which row
      newRow.unshift(state.boardState[j][i]);
    }
    newState.push(newRow);
  }
  state.boardState = newState;
}

const applyGravity = (array) => {
  // moves all null values in an array to the left
  returnArr = [];

  for (let i = array.length - 1; i >= 0; i--) {
    let ele = array[i];
    if (ele !== null) {
      returnArr.unshift(ele);
    }
  }
  let nullsToAdd = array.length - returnArr.length;

  for (let i = 0; i < nullsToAdd; i++) {
    returnArr = [null].concat(returnArr);
  }

  return returnArr;
}

const applyGravityAll = (twodArray) => {
  let returnArr = [];
  for (let i = 0; i < twodArray.length; i++) {
    let row = twodArray[i];
    returnArr.push(applyGravity(row));
  }
  return returnArr;
}
// state.boardState = [
//   [null, null, null],
//   [null, null, null],
//   [null, null, null]
// ]