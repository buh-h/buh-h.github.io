const Y_DIMENSION = 8;
const X_DIMENSION = 8;

const boardContainer = document.getElementById('board');
let puzzleList = [];
let board = Array.from({ length: Y_DIMENSION }, () => Array(X_DIMENSION).fill(null));
let clearList = [];
let minesList = [];

function updateVisibleBoard(state) {
    boardContainer.innerHTML = "";
    for (let y = 0; y < Y_DIMENSION; y++) {
        for (let x = 0; x < X_DIMENSION; x++) {
            const button = document.createElement("button");
            button.classList.add("tile");
            button.dataset.y = y;
            button.dataset.x = x;
            switch (board[y][x]) {
                case -3:
                    button.classList.add("flag");
                    break;
                case -1:
                    button.classList.add("unclear");
                    break;
                case 0:
                    button.classList.add("empty");
                    break;
                default:
                    button.classList.add(`num${board[y][x]}`);
                
            }
            //button.addEventListener('click', handleClick);
            boardContainer.appendChild(button);
        }
    }
}

async function readFile() {
    // fetch('puzzles.txt')
    // .then(response => response.text())
    // .then(data => {
    //     puzzleList = data.split('\n');
    // })
    // .catch(error => {
    //     console.error('Error fetching file:', error);
    // });
    try {
        const response = await fetch('puzzles.txt');
        const data = await response.text(); 
        puzzleList = data.split('\n'); 
        console.log("Loaded File");
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}

function loadRandomBoard() {
    if (puzzleList.length == 0) {
        console.error('puzzleList is empty. Cannot load a random board.');
        return;
    }
    const numPuzzles = puzzleList[0];
    const randomPuzzleIndex = Math.floor(Math.random() * numPuzzles);

    // Parse the board string and store it
    const boardIndex = randomPuzzleIndex * 3 + 1;
    const boardNumbers = puzzleList[boardIndex].trim().split(' ').map(Number);
    for (let i = 0; i < Y_DIMENSION; i++) {
        const row = boardNumbers.slice(i * X_DIMENSION, i * X_DIMENSION + 8);
        board[i] = row;
    }

    // Parse the clear tiles and store it
    clearList = [];
    const clearIndex = randomPuzzleIndex * 3 + 2;
    const clearPairs = puzzleList[clearIndex].trim().split(') (').map(pair => pair.replace(/[()]/g, ''));
    clearList = clearPairs.map(pair => {
        const [x, y] = pair.split(',').map(Number);
        return [x, y];
    });
    // Parse the mine tiles and store it
    minesList = [];
    const minesIndex = randomPuzzleIndex * 3 + 3;
    const minePairs = puzzleList[minesIndex].trim().split(') (').map(pair => pair.replace(/[()]/g, ''));
    minesList = minePairs.map(pair => {
        const [x, y] = pair.split(',').map(Number);
        return [x, y];
    });

    console.log("Clear", puzzleList[clearIndex]);
    console.log("Mines", puzzleList[minesIndex]);
}

function initializeScreen() {

}
window.addEventListener('DOMContentLoaded', async (event) => {
    await readFile();
    loadRandomBoard();
    console.log(clearList);
    console.log(minesList);
    updateVisibleBoard();
});