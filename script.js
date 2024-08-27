// Module for the Gameboard
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; // 3x3 board

    // Get the current state of the board
    const getBoard = () => board;

    // Set a mark (X or O) on the board at the given index
    const setMark = (index, mark) => {
        if (board[index] === "") board[index] = mark;
    };

    // Reset the board to its initial empty state
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    // Expose public methods
    return { getBoard, setMark, resetBoard };
})();

// Factory function for creating Player objects
const Player = (name, mark) => {
    return { name, mark };
};

// Module to control the game logic
const Game = (() => {
    let player1, player2, currentPlayer, gameOver;
    let winner = null;

    // Initialize the game with player names
    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        winner = null;
        displayController.renderBoard();
        displayController.updateMessage();
    };

    // Handle a player's turn
    const playTurn = (index) => {
        if (!gameOver && Gameboard.getBoard()[index] === "") {
            Gameboard.setMark(index, currentPlayer.mark);
            if (checkWinner()) {
                gameOver = true;
                winner = currentPlayer.name;
            } else if (checkTie()) {
                gameOver = true;
            } else {
                switchPlayer();
            }
            displayController.updateMessage();
        }
    };

    // Switch to the other player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // Check if the current player has won
    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === currentPlayer.mark)
        );
    };

    // Check if the game is a tie (all cells filled with no winner)
    const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

    // Reset the game state
    const resetGame = () => {
        gameOver = false;
        winner = null;
        currentPlayer = player1;
    };

    // Getters
    const isGameOver = () => gameOver;
    const getWinner = () => winner;
    const getCurrentPlayer = () => currentPlayer;

    // Expose public methods
    return { startGame, playTurn, resetGame, isGameOver, getWinner, getCurrentPlayer };
})();

// Module to control the display and DOM interactions
const displayController = (() => {
    const boardContainer = document.querySelector("#board");
    const messageDisplay = document.querySelector("#message");
    const restartButton = document.querySelector("#restart");

    // Render the game board on the page
    const renderBoard = () => {
        boardContainer.innerHTML = ""; // Clear existing board
        Gameboard.getBoard().forEach((mark, index) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.index = index;
            square.textContent = mark;
            square.addEventListener("click", handleSquareClick);
            boardContainer.appendChild(square);
        });
    };

    // Handle click on a square
    const handleSquareClick = (e) => {
        const index = e.target.dataset.index;
        Game.playTurn(index);
        renderBoard();
        updateMessage();
    };

    // Update the message display based on the game state
    const updateMessage = () => {
        if (Game.isGameOver()) {
            const winner = Game.getWinner();
            messageDisplay.textContent = winner ? `${winner} wins!` : "It's a tie!";
        } else {
            messageDisplay.textContent = `${Game.getCurrentPlayer().name}'s turn`;
        }
    };

    // Handle the restart button click
    const handleRestartClick = () => {
        Gameboard.resetBoard();
        Game.resetGame();
        renderBoard();
        updateMessage();
    };

    // Add event listener for the restart button
    restartButton.addEventListener("click", handleRestartClick);

    // Expose public methods
    return { renderBoard, updateMessage };
})();

// Event listener for starting the game with player names
document.querySelector("#start-game").addEventListener("click", () => {
    const player1Name = document.querySelector("#player1-name").value || "Player 1";
    const player2Name = document.querySelector("#player2-name").value || "Player 2";
    Game.startGame(player1Name, player2Name);
});
