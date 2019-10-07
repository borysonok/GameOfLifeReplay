/* eslint-disable complexity */
var gameOfLife = {
  width: 20,
  height: 20, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  virtualTable: {}, // keeps the virtual state for the next step

  createAndShowBoard: function() {
    // create <table> element
    var goltable = document.createElement('tbody');

    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + '-' + h + "'></td>";
      }
      tablehtml += '</tr>';
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    gameOfLife.setupBoardEvents();
  },

  forEachCell: function(iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let cell = document.getElementById(`${x}-${y}`);
        iteratorFunc(cell, x, y);
      }
    }
  },

  onClearClick: function() {
    clearInterval(gameOfLife.stepInterval);
    gameOfLife.virtualTable = {};
    var clearCell = function(cell) {
      cell.className = 'dead';
      cell.dataset.status = 'dead';
    };
    gameOfLife.forEachCell(clearCell);
  },

  onRandomResetClick: function() {
    var randomSetCellStatus = function(cell) {
      var rnd = Math.random() * 100;
      if (rnd < 50) {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      } else {
        cell.className = 'alive';
        cell.dataset.status = 'alive';
      }
    };
    gameOfLife.forEachCell(randomSetCellStatus);
  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    var onCellClick = function() {
      if (this.dataset.status === 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    var assignClickEvent = function(cell) {
      cell.addEventListener('click', onCellClick);
    };

    gameOfLife.forEachCell(assignClickEvent);

    var clearBtn = document.getElementById('clear_btn');
    clearBtn.addEventListener('click', this.onClearClick);

    var rndResetBtn = document.getElementById('reset_btn');
    rndResetBtn.addEventListener('click', this.onRandomResetClick);

    var stepBtn = document.getElementById('step_btn');
    stepBtn.addEventListener('click', this.step);

    var playBtn = document.getElementById('play_btn');
    playBtn.addEventListener('click', this.enableAutoPlay);
  },

  step: function() {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors

    var countAliveNeighbours = function(x, y) {
      let aliveNeighbours = 0;
      for (let h = y - 1; h <= y + 1; h++) {
        for (let w = x - 1; w <= x + 1; w++) {
          if (h === y && w === x) {
            continue;
          }
          let cell = document.getElementById(`${w}-${h}`);
          if (
            cell &&
            (cell.className === 'alive' && cell.dataset.status === 'alive')
          ) {
            aliveNeighbours++;
          }
        }
      }
      return aliveNeighbours;
    };

    var defineVirtualBoardState = function(cell, x, y, state) {
      gameOfLife.virtualTable[`${x}-${y}`] = state;
    };

    var setCellNextState = function(cell, x, y) {
      cell.className = gameOfLife.virtualTable[`${x}-${y}`];
      cell.dataset.status = gameOfLife.virtualTable[`${x}-${y}`];
    };

    var defineVirtualNextCellState = function(cell, x, y) {
      let cellAliveNeighbours = countAliveNeighbours(x, y);
      if (cell.className === 'alive') {
        if (cellAliveNeighbours < 2 || cellAliveNeighbours > 3) {
          defineVirtualBoardState(cell, x, y, 'dead');
        }
        if (cellAliveNeighbours === 2 || cellAliveNeighbours === 3) {
          defineVirtualBoardState(cell, x, y, 'alive');
        }
      } else if (cellAliveNeighbours === 3) {
        defineVirtualBoardState(cell, x, y, 'alive');
      }
    };

    // Object.keys(gameOfLife.virtualTable).forEach((key) => {
    //   gameOfLife.virtualTable[key] = '';
    // });

    //gameOfLife.virtualTable = {};

    gameOfLife.forEachCell(defineVirtualNextCellState);
    //gameOfLife.onClearClick();
    //console.log("===== Next: ", gameOfLife.virtualTable);
    gameOfLife.forEachCell(setCellNextState);
    gameOfLife.virtualTable = {};
  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    gameOfLife.stepInterval = setInterval(() => {
      gameOfLife.step();
    }, 500);
  },
};

gameOfLife.createAndShowBoard();
