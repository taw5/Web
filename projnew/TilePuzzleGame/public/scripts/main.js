// on load
document.addEventListener('DOMContentLoaded', function() {
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

    setInterval(function() {
        if (hasGameStarted && !isGamePaused && !hasGameEnded) {
            console.log('Game loop');
            time++;
            timer.innerText = "Time: " + time.toString() + "s";
        }
    }, 1000);


    document.addEventListener('keydown', function(event) {
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
            if (hasGameStarted && !isGamePaused && !hasGameEnded){
                moveTile(movement);
            } else {
                console.log('Game not started');
            }
            if(hasWon()){
                alert("You Won!")
            }
        }

    });
document.getElementById("shuffle").addEventListener("click", function(){
    console.log("shuffle pressed");
    createGameBoard(gameBoardSize);
    time = 0;
    console.log('time reset');
})
    
    const games = document.querySelector('#games');
    for( var game of games.children) {
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
    }

    function createGameBoard(size) {
        var board = [];

        for (var i = 0; i < (size*size)-1; i++) {
            board[i] = i
        }

        board.push(emptyTile);    
        board.sort(function(a, b){return 0.5 - Math.random()});
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
                if (board[(i*size)+j] === emptyTile) {
                    col.classList.add('empty');
                    emptyTilePosition = col.id;
                } else {
                    col.classList.add('tile');
                }
                col.innerText = (board[(i*size)+j] + 1);
                row.appendChild(col);
            }
            gameBoard.appendChild(row);
        }
    }

    function move(event){
        if(this.classList.contains('empty'))
            return;
        var id = this.id.split('-');
        var row = parseInt(id[1]);
        var col = parseInt(id[2]);
        if (isAdjacentToAnEmptyTile(row, col)) {
            console.log('Move tile');
            swapTiles(this);
        }
    }

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
    }

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
    }

    function isAdjacentToAnEmptyTile(row, col) {
        var data = emptyTilePosition.split('-');
        var emptyRow = parseInt(data[1]);
        var emptyCol = parseInt(data[2]);
        return (row === emptyRow && (col === emptyCol + 1 || col === emptyCol - 1)) ||
            (col === emptyCol && (row === emptyRow + 1 || row === emptyRow - 1));
    }

   
    function hasWon(){
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
    }
    



});