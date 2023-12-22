document.addEventListener('DOMContentLoaded', function () {
  const gameBoard = document.querySelector('.game-board');
  const tiles = document.querySelectorAll('.tile');
  let emptyTile = document.querySelector('.empty');

  // shuffling the tiles when loading page using math.random function later on
  shuffleTiles();

  gameBoard.addEventListener('click', function (event) {
    const clickedTile = event.target;

    if (clickedTile.classList.contains('tile') && isAdjacent(clickedTile, emptyTile)) {
      swapTiles(clickedTile, emptyTile);
      emptyTile = clickedTile;

      if (isPuzzleSolved()) {
        alert('Congratulations! You solved the puzzle.');
      }
    }
  });

  function isAdjacent(tile, emptyTile) {
    const tileIndex = Array.from(tiles).indexOf(tile);
    const emptyIndex = Array.from(tiles).indexOf(emptyTile);

    const tileRow = Math.floor(tileIndex / 4); // 4x4 grid which is why i'm dividing by 4
    const tileCol = tileIndex % 4; // position of tile
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    // boolean statement checking if it's adjacent, (north, south, west, east)
    return Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;
  }

  function swapTiles(tile, emptyTile) {
    // swapping the content within each tile
    const tempText = tile.innerText;
    tile.innerText = emptyTile.innerText;
    emptyTile.innerText = tempText;
  }

  
  function isPuzzleSolved() {
    for (let i = 0; i < tiles.length - 1; i++) { // loops through all tiles (tiles.length-1 because of the empty tile, so realistically it's 15 repitions )
      const tileValue = parseInt(tiles[i].innerText);
      // fixed bug here it didnt calculate the puzzle beign solved correctly
      if (tileValue !== i + 1 && tileValue !== 0) {
        return false;
      } // shortcircuit
    }
    
    return true;
  }
  function shuffleTiles() {
    const tileArray = Array.from(tiles);

    for (let i = tileArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // math.random logic

      // swapping the text content
      const tempText = tileArray[i].innerText;
      tileArray[i].innerText = tileArray[j].innerText;
      tileArray[j].innerText = tempText;
    }

    // finding the new empty tile for later usage
    emptyTile = tileArray.find(tile => tile.innerText === ''); // find js method which returns the value of the first element in the array where predicate is true, and undefined otherwise. helpful in this matrix


  }
});
