// on load
document.addEventListener('DOMContentLoaded', function () {
    console.log('main.js loaded');
    var hasGameStarted = true;
    var isGamePaused = false;
    var hasGameEnded = false;
    var gameBoardSize = 2; // 2x2 it should be a square matrix where n >= 2
    var gameBoard = document.getElementById('game-screen');
    var timer = document.getElementById('timer');
    var time = 0;
    var moves = 0;
    var score = 0;
    var scores = [];
    var emptyTile = -1;
    var movesCount = document.getElementById("movecount");
    var emptyTilePosition = -1;
    gameBoard.classList.add('hidden');
    var winscreen = document.getElementById("win");
    displayScores()
    function addScoreToLocalStorage(score) {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
    
        scores.push(score);
        if(!hasGameEnded){ // had a bug where it registers scores if you simply spam arrow keys after winning
        localStorage.setItem('scores', JSON.stringify(scores));}
    }
   
    function checkHighScore(score) {
      
        let scores = JSON.parse(localStorage.getItem('scores')) || [];


        if (scores.length > 0) {

            let lowestScore = Math.min(...scores.map(score => score.totalScore)); // math.min syntax requires ..., scores.map looks through all totalscores and finds the lowest score
    
            if (score < lowestScore) {
                        

                console.log("HIGH SCORE!!!")
                // display the high score message
                document.getElementById('highScoreAlert').style.visibility = 'visible';
                return true; 
            }
        } else {
            console.log("HIGH SCORE!!!")
            
            document.getElementById('highScoreAlert').style.visibility = 'visible';
            return true; //  new high score
        }
    
        return false; 
    }
    
    function displayScores() {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        
        let scoresTable = '<table id="scoresTable"><tr><th>Moves</th><th>Time</th><th>Total Score</th><th>Game Type</th></tr>';// table setting
        
        scores.forEach(function(score) {
            scoresTable += '<tr><td>' + score.moves + '</td><td>' + score.time + 's</td><td>' + score.totalScore + '</td><td>' + score.Game_Type+"x"+score.Game_Type + '</td></tr>';
        });
        
        scoresTable += '</table>';
       
    
        // Display scores table in the 'scores' div (with id "scores")
        document.getElementById('scores').innerHTML = scoresTable;
    }
    


    console.log('-------')
    setInterval(function () {
        if (hasGameStarted && !isGamePaused && !hasGameEnded) {
            console.log('Game loop');
            time++;
            timer.innerText = "Time: " + time.toString() + "s";
        }
    }, 1000); // simply a time function that calculates the amount of seconds passed

    document.getElementById("tryAgain").addEventListener("click", function(){
        winscreen.style.visibility = "hidden";
        console.log("hi")
        createGameBoard(gameBoardSize);





    })



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
                winscreen.style.visibility = "visible";
                score = moves+time;
                if(checkHighScore(score))
                {console.log("test");

                document.getElementById('highScoreAlert').style.visibility = 'visible'}

                document.getElementById("winScore").innerText = "Moves: "+moves.toString()+"   Time: "+time.toString()+"s"+ "\n Score: "+score.toString();
                addScoreToLocalStorage({ moves: moves, time: time, totalScore: score, Game_Type: gameBoardSize });

                hasGameEnded = true;
                displayScores()
                
            }
        }

    }); // listens to the user's space bar input, arrow key inputs, and click input.
    document.getElementById("shuffle").addEventListener("click", function () {
        console.log("shuffle pressed");

        createGameBoard(gameBoardSize);

        time = 0;
        console.log('time reset');
        moves =0;
    }) // quick function made to allow for the functionality of shuffling the board. resets time as well.

    const games = document.querySelector('#games');
    for (var game of games.children) {
        game.id = 'game-' + game.querySelector('a').innerText;
        var aHref = game.getElementsByTagName('a')[0];
        aHref.addEventListener('click', onGameSelect);
    }


    function onGameSelect(event) {
        winscreen.style.visibility = "hidden";

        event.preventDefault();
        console.log('Game id: ' + this.innerText);
        gameBoardSize = parseInt(this.innerText.split('x')[0]);
        console.log('Game size: ' + gameBoardSize);
        gameBoard.classList.remove('hidden');
        document.querySelector('#on_start').classList.add('hidden');
        createGameBoard(gameBoardSize);
    } // when selecting the type of board it creates the board and sets the visibility as on start as hidden, but the gameboard as not hidden.

    function createGameBoard(size) {
        document.getElementById('highScoreAlert').style.visibility = 'hidden';
        hasGameStarted = true;
        isGamePaused = false;
        hasGameEnded = false;
        time = 0;
       
        moves = 0;
        
        movesCount.innerText = "Moves: "+moves;
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

    } // Creates gameboard, math.razndom logic, and is through row-major order where it goes through each element in the row then goes to the next row. This is how the board is created.

    function move(event) {
        
        var id = this.id.split('-');
        var row = parseInt(id[1]); // the id variable allows for usage such as this to determine positive of what's being moved.
        var col = parseInt(id[2]);
        if (this.classList.contains('empty'))
            return;
        if (isAdjacentToAnEmptyTile(row, col)) {
            console.log('Move tile');

            swapTiles(this);

            if (hasWon()) {
                winscreen.style.visibility = "visible";
                score = moves+time;
                document.getElementById("winScore").innerText = "Moves: "+moves.toString()+"   Time: "+time.toString()+"s"+ "\n Score: "+score.toString();
                addScoreToLocalStorage({ moves: moves, time: time, totalScore: score, Game_Type: gameBoardSize });

                hasGameEnded = true;
                displayScores()   
            }

                
        }
    } // Moves the tiles logic where it checks if it's not possible to move or not. It uses the empty class to confirm if what we're pressing isn't an empty as well.
    function isLegalMove(row, col) {
        return row >= 0 && row < gameBoardSize && col >= 0 && col < gameBoardSize;
    }
    function moveTile(movement) {
        console.log('Move tile');
        let currentEmptyTile = 
            document.getElementById(emptyTilePosition);
        console.log('Current empty tile: ' + currentEmptyTile.id);
        let currentEmptyTilePosition = currentEmptyTile.id.split('-');
        let currentEmptyTileRow = parseInt(currentEmptyTilePosition[1]);
        let currentEmptyTileCol = parseInt(currentEmptyTilePosition[2]);
        MOVES = { "UP": [1,0], "DOWN": [-1,0], "LEFT": [0,1], "RIGHT": [0,-1]} 
        move = MOVES[movement.toUpperCase()];
        console.log(move);
        console.log(isLegalMove(currentEmptyTileRow+move[0], currentEmptyTileCol+move[1]));
        if(!isLegalMove(currentEmptyTileRow+move[0], currentEmptyTileCol+move[1]))
            return;
        let tileToMove = document.getElementById('col-' + (currentEmptyTileRow + move[0]) + '-' + (currentEmptyTileCol+move[1]));
        console.log('col-' + (currentEmptyTileRow + move[0]) + '-' + (currentEmptyTileCol+move[1]));
        swapTiles(tileToMove);

    }// actually logic the tile, here it's based on left,right,up,down arrow key presses, the movement variable is determined earlier on in the event listener. Each if statement calls the swapTiles() function to initiate the moving, otherwise it prints the direction it cannot move.
   

    function swapTiles(tile) {
        moves++;
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
        movesCount.innerText = "Moves: "+moves;
    
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
