const boardContainer = document.getElementById('board');

// Example Minesweeper board state
const boardState = [
    [-3, -2. -1, 0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

function createBoard(state) {
    boardContainer.innerHTML = "";

    state.forEach((row, y) => {
        row.forEach((col, x) => {
            const button = document.createElement("button");
            button.className = "tile";
            button.dataset.y = y;
            button.dataset.x = x;
            button.style.backgroundImage = `url('images/${cell}.png')`;
            button.addEventListener('click', handleClick);
            boardContainer.appendChild(button);
        });
    });
}

createBoard(boardState);