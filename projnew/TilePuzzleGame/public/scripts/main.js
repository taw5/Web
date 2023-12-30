// on load
document.addEventListener('DOMContentLoaded', function () {
    console.log('main.js loaded');
    var hasGameStarted = false;
    var isGamePaused = false;
    var hasGameEnded = false;
    var gameBoardSize = 2; // 2x2 it should be a square matrix where n >= 2
    var gameBoard = document.getElementById('game-screen');
    var timer = document.getElementById('timer');
    var time = 0;
    var emptyTile = -1;
    var emptyTilePosition = -1;
    gameBoard.classList.add('hidden');

    setInterval(function () {
        if (hasGameStarted && !isGamePaused && !hasGameEnded) {
            console.log('Game loop');
            time++;
            timer.innerText = "Time: " + time.toString() + "s";
        }
    }, 1000); // simply a time function that calculates the amount of seconds passed


    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            console.log('Space pressed');
            if (hasGameStarted) {
                if (isGamePaused) {
                    console.log('Game unpaused');
                    isGamePaused = false;
                } else {
                    console.log('Game paused');
                    isGamePaused = true;
                }
            } else {
                console.log('Game started');
                hasGameStarted = true;
            }
        } else if (event.code.includes('Arrow')) {
            let movement = event.code.substring(5).toLowerCase();
            console.log('Arrow pressed: ' + movement);
            if (hasGameStarted && !isGamePaused && !hasGameEnded) {
                moveTile(movement);
            } else {
                console.log('Game not started');
            }
            if (hasWon()) {
                alert("You Won!")
            }
        }

    }); // listens to the user's space bar input, arrow key inputs, and click input.
    document.getElementById("shuffle").addEventListener("click", function () {
        console.log("shuffle pressed");
        createGameBoard(gameBoardSize);
        time = 0;
        console.log('time reset');
    }) // quick function made to allow for the functionality of shuffling the board. resets time as well.

    const games = document.querySelector('#games');
    for (var game of games.children) {
        game.id = 'game-' + game.querySelector('a').innerText;
        var aHref = game.getElementsByTagName('a')[0];
        aHref.addEventListener('click', onGameSelect);
    }

    function onGameSelect(event) {
        event.preventDefault();
        console.log('Game id: ' + this.innerText);
        gameBoardSize = parseInt(this.innerText.split('x')[0]);
        console.log('Game size: ' + gameBoardSize);
        gameBoard.classList.remove('hidden');
        document.querySelector('#on_start').classList.add('hidden');
        createGameBoard(gameBoardSize);
    } // when selecting the type of board it creates the board and sets the visibility as on start as hidden, but the gameboard as not hidden.

    function createGameBoard(size) {
        var board = [];

        for (var i = 0; i < (size * size) - 1; i++) {
            board[i] = i
        }

        board.push(emptyTile);
        board.sort(function (a, b) { return 0.5 - Math.random() });
        var gameBoard = document.getElementById('tiles');
        gameBoard.innerHTML = '';
        for (var i = 0; i < size; i++) {
            var row = document.createElement('div');
            row.classList.add('row');
            for (var j = 0; j < size; j++) {
                var col = document.createElement('div');
                col.classList.add('col');
                col.addEventListener('click', move);
                col.id = 'col-' + i + '-' + j;
                if (board[(i * size) + j] === emptyTile) {
                    col.classList.add('empty');
                    emptyTilePosition = col.id;
                } else {
                    col.classList.add('tile');
                }
                col.innerText = (board[(i * size) + j] + 1);
                row.appendChild(col);
            }
            gameBoard.appendChild(row);
        }
    } // Creates gameboard, math.random logic, and is through row-major order where it goes through each element in the row then goes to the next row. This is how the board is created.

    function move(event) {
        if (this.classList.contains('empty'))
            return;
        var id = this.id.split('-');
        var row = parseInt(id[1]); // the id variable allows for usage such as this to determine positive of what's being moved.
        var col = parseInt(id[2]);
        if (isAdjacentToAnEmptyTile(row, col)) {
            console.log('Move tile');
            swapTiles(this);
        }
    } // Moves the tiles logic where it checks if it's not possible to move or not. It uses the empty class to confirm if what we're pressing isn't an empty as well.

    function moveTile(movement) {
        console.log('Move tile');
        let currentEmptyTile =
            document.getElementById(emptyTilePosition);
        console.log('Current empty tile: ' + currentEmptyTile.id);
        let currentEmptyTilePosition = currentEmptyTile.id.split('-');
        let currentEmptyTileRow = parseInt(currentEmptyTilePosition[1]);
        let currentEmptyTileCol = parseInt(currentEmptyTilePosition[2]);
        if (movement === 'up') {
            if (currentEmptyTileRow < gameBoardSize - 1) {
                let tileToMove = document.getElementById('col-' + (currentEmptyTileRow + 1) + '-' + currentEmptyTileCol);
                console.log('Tile to move: ' + tileToMove.id);
                swapTiles(tileToMove);
            } else {
                console.log('Cannot move up');
            }
        } else if (movement === 'down') {
            if (currentEmptyTileRow > 0) {
                let tileToMove = document.getElementById('col-' + (currentEmptyTileRow - 1) + '-' + currentEmptyTileCol);
                console.log('Tile to move: ' + tileToMove.id);
                swapTiles(tileToMove);
            } else {
                console.log('Cannot move down');
            }
        } else if (movement === 'left') {
            if (currentEmptyTileCol < gameBoardSize - 1) {
                let tileToMove = document.getElementById('col-' + currentEmptyTileRow + '-' + (currentEmptyTileCol + 1));
                console.log('Tile to move: ' + tileToMove.id);
                swapTiles(tileToMove);
            } else {
                console.log('Cannot move left');
            }
        } else if (movement === 'right') {
            if (currentEmptyTileCol > 0) {
                let tileToMove = document.getElementById('col-' + currentEmptyTileRow + '-' + (currentEmptyTileCol - 1));
                console.log('Tile to move: ' + tileToMove.id);
                swapTiles(tileToMove);
            } else {
                console.log('Cannot move right');
            }
        }
    } // actually moves the tile, here it's based on left,right,up,down arrow key presses, the movement variable is determined earlier on in the event listener. Each if statement calls the swapTiles() function to initiate the moving, otherwise it prints the direction it cannot move.

    function swapTiles(tile) {
        var emptyTile = document.getElementById(emptyTilePosition);
        var emptyTileText = emptyTile.innerText;
        var tileText = tile.innerText;
        tile.innerText = emptyTileText;
        emptyTile.innerText = tileText;
        emptyTile.classList.remove('empty');
        emptyTile.classList.add('tile');
        tile.classList.remove('tile');
        tile.classList.add('empty');
        emptyTilePosition = tile.id;
        console.log('Empty tile position: ' + emptyTilePosition);
        emptyTile.style.animation = 'wobble 0.5s ease-in-out';
        tile.style.animation = 'wobble 0.5s ease-in-out';
    } // Gets the emptytile and uses it to move it and replace it with what's being moved, prints the empty tile position and saves the emptytileposition using tile.id that was used earlier.

    function isAdjacentToAnEmptyTile(row, col) {
        var data = emptyTilePosition.split('-');
        var emptyRow = parseInt(data[1]); // again more use of id to determin position of a tile, in this case it's the position in the matrix of the emptytile.
        var emptyCol = parseInt(data[2]);
        return (row === emptyRow && (col === emptyCol + 1 || col === emptyCol - 1)) ||
            (col === emptyCol && (row === emptyRow + 1 || row === emptyRow - 1));
    } // checks ifadjacenttoemptytile that's called in the move function.


    function hasWon() {
        var hasWon = true;
        var tiles = document.getElementsByClassName('tile');
        for (var i = 0; i < tiles.length; i++) {
            var id = tiles[i].id.split('-');
            var row = parseInt(id[1]); // this would be the position of row
            var col = parseInt(id[2]); // this would be position of col


            var expectedValue = (row * gameBoardSize) + col + 1; /* since we have the positions and size 
            of matrix we can calculate the desired value. e.g. 
            row = 1, col = 1, value expected would be "5"... 
            it cannot ever be 0 so the 0(empty square) cannot ever be declared as correct below.    
            */

            if (parseInt(tiles[i].innerText) !== expectedValue) {
                hasWon = false;
                tiles[i].classList.remove('correct');
            } else {
                if (!tiles[i].classList.contains('empty')) {
                    tiles[i].classList.add('correct');
                }
            }
        }
        return hasWon;
    } // checks if user has won using math logic, if the tile that we're scanning/analyzing has this expected value and is done so in every tile, the user is declared as a winner. hasWon is falce when one of the tiules it not equal to the expectedValue.




});