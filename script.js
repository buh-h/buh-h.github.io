const Y_DIMENSION = 8;
const X_DIMENSION = 8;

//const boardContainer = document.getElementById('board');
let puzzleList = [];
let board = Array.from({ length: Y_DIMENSION }, () => Array(X_DIMENSION).fill(null));
let clearList = [];
let minesList = [];
let userCleared = [];
let userFlagged = [];

function updateVisibleBoard(state) {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = "";
    for (let y = 0; y < Y_DIMENSION; y++) {
        for (let x = 0; x < X_DIMENSION; x++) {
            const button = document.createElement("button");
            button.classList.add("tile");
            button.dataset.y = y;
            button.dataset.x = x;
            // Adds the appropriate class based on board value
            switch (board[y][x]) {
                case -3:
                    button.classList.add("flag");
                    break;
                case -1:
                    button.classList.add("unclear");
                    button.addEventListener('mousedown', handleTileClick);
                    button.addEventListener(`contextmenu`, (e) => {
                        e.preventDefault();
                    });
                    break;
                case 0:
                    button.classList.add("clear");
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
        // console.log("Loaded File");
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}

function loadRandomBoard() {

    if (puzzleList.length == 0) {
        console.error('puzzleList is empty. Cannot load a random board.');
        return;
    }

    userCleared = [];
    userFlagged = [];

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
    if (puzzleList[clearIndex].length != 0) {
        clearList = clearPairs.map(pair => {
            const [y, x] = pair.split(',').map(Number);
            return [y, x];
        });
    }   

    // Parse the mine tiles and store it
    minesList = [];
    const minesIndex = randomPuzzleIndex * 3 + 3;
    const minePairs = puzzleList[minesIndex].trim().split(') (').map(pair => pair.replace(/[()]/g, ''));
    if (puzzleList[minesIndex].length != 0) {
        minesList = minePairs.map(pair => {
            const [y, x] = pair.split(',').map(Number);
            return [y, x];
        });
    }

    updateVisibleBoard();
}

function handleTileClick(event) {
    event.preventDefault(); 

    const tile = event.target;
    const y = parseInt(tile.dataset.y);
    const x = parseInt(tile.dataset.x);
    switch (event.button) {
        case 0:
            if (tile.classList.contains('placed-clear')) {
                tile.classList.remove('placed-clear');
                const index = userCleared.findIndex(point => 
                        point[0] == y && point[1] == x);
                userCleared.splice(index, 1);
            } 
            else if (tile.classList.contains('placed-flag')){
                tile.classList.remove('placed-flag');
                const index = userFlagged.findIndex(point => 
                        point[0] == y && point[1] == x);
                userFlagged.splice(index, 1);

                tile.classList.add('placed-clear');
                userCleared.push([y, x]);
            } 
            else {
                tile.classList.add('placed-clear');
                userCleared.push([y, x]);
            }
            break;
        case 2:
            if (tile.classList.contains('placed-flag')) {
                tile.classList.remove('placed-flag');
                const index = userFlagged.findIndex(point => 
                    point[0] == y && point[1] == x);
                userFlagged.splice(index, 1);
            } 
            else if (tile.classList.contains('placed-clear')) {
                tile.classList.remove('placed-clear');
                const index = userCleared.findIndex(point => 
                        point[0] == y && point[1] == x);
                userCleared.splice(index, 1);

                tile.classList.add('placed-flag');
                userFlagged.push([y, x]);
            } 
            else {
                tile.classList.add('placed-flag');
                userFlagged.push([y, x]);
            }
            break;
    }

    //console.log(userCleared, userFlagged);
}

function getTileAt(y, x) {
    const tile = document.querySelector(`.tile[data-y="${y}"][data-x="${x}"]`);
    return tile;
}

function clearUserInput() {
    userCleared.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.remove('placed-clear', 'correct', 'incorrect', 'blast');
    });
    userCleared = [];
    userFlagged.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.remove('placed-flag', 'correct', 'incorrect');
    });
    userFlagged = [];

    clearList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.remove('solution-clear', 'correct', 'incorrect');
    });
    minesList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.remove('solution-mine', 'correct', 'incorrect');
    });

}

function revealSolution() {
    clearUserInput();
    clearList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.add('solution-clear');
    });
    minesList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        tile.classList.add('solution-mine');
    });
}

function checkUserAnswer() {
    clearList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        if (!userCleared.some(user => user[0] == point[0] && user[1] == point[1])) {
            //tile.classList.add('solution-clear');
            tile.classList.add('incorrect');
        } else {
            tile.classList.add('correct');
        }
    });
    minesList.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        if (!userFlagged.some(user => user[0] == point[0] && user[1] == point[1])) {
            tile.classList.add('solution-mine', 'incorrect');
        } else {
            tile.classList.add('correct');
        }
    });

    userCleared.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        if (!clearList.some(user => user[0] == point[0] && user[1] == point[1])) {
            tile.classList.add('incorrect');
        } 
        if (minesList.some(user => user[0] == point[0] && user[1] == point[1])) {
            tile.classList.remove('solution-mine', 'placed-clear');
            tile.classList.add('blast');
        }
    });
    userFlagged.forEach(point => {
        const tile = getTileAt(point[0], point[1]);
        if (!minesList.some(user => user[0] == point[0] && user[1] == point[1])) {
            tile.classList.add('incorrect');
        }
    });


}

window.addEventListener('DOMContentLoaded', async (event) => {
    // Setup for minesweeper board
    await readFile();
    loadRandomBoard();

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', clearUserInput);
    const checkButton = document.getElementById('check');
    checkButton.addEventListener('click', checkUserAnswer);
    const solutionButton = document.getElementById('solution');
    solutionButton.addEventListener('click', revealSolution);
    const nextButton = document.getElementById('next');
    nextButton.addEventListener('click', loadRandomBoard);
});