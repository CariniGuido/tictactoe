const PLAYER_X = 'X';
const PLAYER_O = 'O';
const EMPTY_CELL = '';
const BOARD_SIZE = 3;

let currentPlayer = PLAYER_X;
let gameBoard = createBoard();

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function createBoard() {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = EMPTY_CELL;
        }
    }
    return board;
}
function handleCellClick() {
    const row = Number(this.dataset.row);
    const col = Number(this.dataset.col);
    if (gameBoard[row][col] !== EMPTY_CELL) {
      return;
    }
    gameBoard[row][col] = currentPlayer;
    renderBoard();
    if (checkWin()) {
      Swal.fire({
        title: `${currentPlayer} ha ganado!`,
        icon: 'success',
        confirmButtonText: 'Reiniciar'
      }).then(() => {
        resetGame();
      });
    } else if (checkTie()) {
      Swal.fire({
        title: 'Empate!',
        icon: 'warning',
        confirmButtonText: 'Reiniciar'
      }).then(() => {
        resetGame();
      });
    } else {
      currentPlayer = PLAYER_O;
      computerTurn();
    }
  }

function renderBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            cell.textContent = gameBoard[i][j];
        }
    }
}

function checkWin() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (
            gameBoard[i][0] === currentPlayer &&
            gameBoard[i][1] === currentPlayer &&
            gameBoard[i][2] === currentPlayer
        ) {
            return true;
        }
        if (
            gameBoard[0][i] === currentPlayer &&
            gameBoard[1][i] === currentPlayer &&
            gameBoard[2][i] === currentPlayer
        ) {
            return true;
        }
    }
    if (
        gameBoard[0][0] === currentPlayer &&
        gameBoard[1][1] === currentPlayer &&
        gameBoard[2][2] === currentPlayer
    ) {
        return true;
    }
    if (
        gameBoard[0][2] === currentPlayer &&
        gameBoard[1][1] === currentPlayer &&
        gameBoard[2][0] === currentPlayer
    ) {
        return true;
    }
    return false;
}

function checkTie() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] === EMPTY_CELL) {
                return false;
            }
        }
    }
    return true;
}

function resetGame() {
    gameBoard = createBoard();
    renderBoard();
    currentPlayer = PLAYER_X;
}

function computerTurn() {
    const emptyCells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (gameBoard[i][j] === EMPTY_CELL) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
  
    const bestMove = findBestMove(gameBoard);
    const { row, col } = bestMove;
  
    gameBoard[row][col] = currentPlayer;
    renderBoard();
  
    if (checkWin()) {
        Swal.fire({
            title: `${currentPlayer} has perdído!`,
            icon: 'warning',
            confirmButtonText: 'Reiniciar' })
    } else if (checkTie()) {
      alert('Empate!');
      resetGame();
    } else {
      currentPlayer = PLAYER_X;
    }
  }
  
  function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;
  
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY_CELL) {
          board[i][j] = currentPlayer;
          const score = minimax(board, 0, false);
          board[i][j] = EMPTY_CELL;
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }
  
    return bestMove;
  }
  
  function minimax(board, depth, alpha, beta, isMaximizing) {
    if (checkWin() && currentPlayer === PLAYER_X) {
      return 1;
    } else if (checkWin() && currentPlayer === PLAYER_O) {
      return -1;
    } else if (checkTie()) {
      return 0;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
  
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (board[i][j] === EMPTY_CELL) {
            board[i][j] = PLAYER_X;
            const score = minimax(board, depth + 1, alpha, beta, false);
            board[i][j] = EMPTY_CELL;
            if (score > bestScore) {
              bestScore = score;
              if (bestScore >= beta) {
                return bestScore;
              }
              alpha = Math.max(alpha, bestScore);
            }
          }
        }
      }
  
      return bestScore;
    } else {
      let bestScore = Infinity;
  
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (board[i][j] === EMPTY_CELL) {
            board[i][j] = PLAYER_O;
            const score = minimax(board, depth + 1, alpha, beta, true);
            board[i][j] = EMPTY_CELL;
            if (score < bestScore) {
              bestScore = score;
              if (bestScore <= alpha) {
                return bestScore;
              }
              beta = Math.min(beta, bestScore);
            }
          }
        }
      }
  
      return bestScore;
    }
}