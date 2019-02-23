let rightClick = false;

let allWords = [];
let oldAllWords = [];
let first = true;

let unconfirmedX = [];
let unconfirmedY = [];

let tempScore = 0;
let scores = [0, 0];

let roomID = 1;
let player = -1;
let turn = -1;

let racks = [];

console.log(firebase);
let database = firebase.database();
let ref = database.ref('room/' + roomID);

function updateDB(board, letters, turn, scores, allWords, oldAllWords, rack) {
  ref.update({ board: JSON.stringify(board), letters: JSON.stringify(letters), 
    turn: JSON.stringify(turn), scores: JSON.stringify(scores), 
    allWords: JSON.stringify(allWords), oldAllWords: JSON.stringify(oldAllWords)
  });

  if (player === 0) {
    ref.update({ rack0: JSON.stringify(rack) });
  } else if (player === 1) {
    ref.update({ rack1: JSON.stringify(rack) });
  }
}

function verifyWord(word) {
  let found = false;
  let length = wordList.length-1;
  let index = length / 2;
  let min = 0;
  let max = length;

  while (!found && max-min >= 2) {
    if (word === wordList[index]) {
      found = true;
      max = min;
    } else {
      if (word < wordList[index]) {
        max = index;
      } else {
        min = index;
      }
      index = Math.floor((max + min) / 2)
    }
  }

  return found;
}

function setup() {
  console.log(wordList);
  textAlign(CENTER);

  //USE LOCALSTORAGE
  if (localStorage.getItem('player') === '0') {
    player = 0;
  } else if (localStorage.getItem('player') === '1') {
    player = 1;
  } else {
    player = (confirm('Player 1?')) ? 0 : 1;
    localStorage.setItem('player', player);
  }

  createCanvas(400, 650);

 /* rack = new Rack();
  
  letters = new Letters();
  rack.setRack(letters.add(rack.getRack()));

  board = new Board();*/

  ref.on('value', (data) => {
    try {
      scores = JSON.parse(data.val().scores);
    } catch (e) {
      scores = [0, 0];
    }
  
    try {
      turn = JSON.parse(data.val().turn);
    } catch (e) {
      turn = 0; // player 1 starts
    }

    try {
      allWords = JSON.parse(data.val().allWords);
    } catch (e) {
      allWords = [];
    }

    try {
      oldAllWords = JSON.parse(data.val().oldAllWords);
    } catch (e) {
      oldAllWords = [];
    }
    
    rack = new Rack();
    letters = new Letters();
    try {
      if (player === 0) {
        rack.rack = JSON.parse(data.val().rack0);
      } else if (player === 1) {
        rack.rack = JSON.parse(data.val().rack1);
      }
    } catch (e) {
      rack.setRack(letters.add(rack.getRack()));
      if (player === 0) {
        ref.update({ rack0: JSON.stringify(rack.rack) });
      } else if (player === 1) {
        ref.update({ rack1: JSON.stringify(rack.rack) });
      }
    }
    board = new Board();
  });

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClick = true;
    return false;
  });

  document.getElementById('skip').onclick = () => {
    document.getElementById('reset').click();
    turn += 1; turn %= 2;
    ref.update( { turn: JSON.stringify(turn) })
  }

  // ON PLAY
  document.getElementById('play').onclick = () => {
    if (turn === player) {

      let invalid = false;
      let count = 0;

      for (let i = 0; i < RACK_LEN; i++) {
        if (rack.rack[i][0].value === undefined) {
          // one move has been made;
          count++
          break;
        }
      }
      if (count < 1) {
        invalid = true;
      }

      if (!invalid && board.boardContent[7][7].value === undefined) {
        invalid = true;
      }
      if (!(board.boardContent[6][7].value !== undefined || board.boardContent[8][7].value !== undefined ||
          board.boardContent[7][6].value !== undefined || board.boardContent[7][8].value !== undefined)) {
        invalid = true;
      }

      allWords = [];
      connect = false;
      for (let i = 0; i < TILES; i++) {
        for (let j = 0; j < TILES; j++) {

          if (!board.boardContent[i][j].confirmed && board.boardContent[i][j].value !== undefined) {
            unconfirmedX[unconfirmedX.length] = j;
            unconfirmedY[unconfirmedY.length] = i;

            let sameX = true;
            let sameXIndex = -1;
            
            for (e = 0; e < unconfirmedX.length; e++) {
              if (sameXIndex > -1 && sameXIndex !== unconfirmedX[e]) {
                sameX = false;
              } else {
                sameXIndex = unconfirmedX[e];
              }
            }

            if (!sameX) {
              let sameY = true;
              let sameYIndex = -1;

              for (f = 0; f < unconfirmedY.length; f++) {
                if (sameYIndex > -1 && sameYIndex !== unconfirmedY[f]) {
                  sameY = true;
                  invalid = true;
                } else {
                  sameYIndex = unconfirmedY[f];
                }
              }
            }
          }

          let x = 0;
          let word = '';
          if (board.boardContent[i][j].value !== undefined && board.boardContent[i-1][j].value === undefined &&
              board.boardContent[i+1][j].value !== undefined) {
            x = i;
            while (board.boardContent[x][j].value !== undefined) {
              word += board.boardContent[x][j].letter;
              x++;
            }

            console.log(oldAllWords.indexOf(word))

            if (oldAllWords.indexOf(word) === -1) { // word not already counted
              x = i;
              while (board.boardContent[x][j].value !== undefined) {
                tempScore += board.boardContent[x][j].value;
                if (board.boardContent[x][j].powerup === '2L') {
                  tempScore += board.boardContent[x][j].value;
                } else if (board.boardContent[x][j].powerup === '3L') {
                  tempScore += (2*board.boardContent[x][j].value);
                }
                x++;
              }

              if (!verifyWord(word)) invalid = true;
            }
            
            allWords[allWords.length] = word;
          }

          x = 0;
          word = '';
          if (board.boardContent[i][j].value !== undefined && board.boardContent[i][j-1].value === undefined &&
              board.boardContent[i][j+1].value !== undefined) {
            x = j;
            while (board.boardContent[i][x].value !== undefined) {
              word += board.boardContent[i][x].letter;
              x++;
            }

            console.log(oldAllWords.indexOf(word))

            if (oldAllWords.indexOf(word) === -1) { // word not already counted
              x = j;
              while (board.boardContent[i][x].value !== undefined) {
                tempScore += board.boardContent[i][x].value;
                if (board.boardContent[i][x].powerup === '2L') {
                  tempScore += board.boardContent[i][x].value;
                } else if (board.boardContent[i][x].powerup === '3L') {
                  tempScore += (2*board.boardContent[i][x].value);
                }
                x++;
              }
              if (!verifyWord(word)) invalid = true;
            }

            allWords[allWords.length] = word;
          }

          if (board.boardContent[i][j].value !== undefined && !first) {
            if (i === 0) {
              
            } else {
              if (board.boardContent[i-1][j].confirmed || board.boardContent[i+1][j].confirmed || 
                board.boardContent[i][j-1].confirmed || board.boardContent[i][j+1].confirmed) {
              } else {  
                invalid = true;
                break;
              }
            }
          }
        }

        if (invalid) {
          break;
        }
      }
      unconfirmedX = []
      unconfirmedY = []

      console.log(tempScore);

      if (invalid) {
        console.log('INVALID!');
      } else {
        //VALID

        first = false;
        
        oldAllWords = allWords;

        // double and triple word powerups
        for (let u = 0; u < TILES; u++) {
          for (let v = 0; v < TILES; v++) {
            if (!board.boardContent[u][v].confirmed && board.boardContent[u][v].value) {
              if (board.boardContent[u][v].powerup === '2W') {
                tempScore *= 2;
              } else if (board.boardContent[u][v].powerup === '3W') {
                tempScore *= 3;
              }
              board.boardContent[u][v].powerup = '';
            }
          }
        }

        scores[player]+= tempScore;
        tempScore = 0;
        console.log(scores[player]);

        rack.setRack(letters.add(rack.getRack()));

        for (let a = 0; a < TILES; a++) {
          for (let b = 0; b < TILES; b++) {
            if (board.boardContent[a][b].value !== undefined) {
              board.boardContent[a][b].confirmed = true;
            }
          }
        }
        turn += 1; turn %= 2;
        
        updateDB(board.boardContent, letters.letters, turn, scores, allWords, oldAllWords, rack.rack);
      }

      // temporary
      //ref.update({ turn: JSON.stringify(turn), scores: JSON.stringify(scores) });
    } else {
      rightClick = true;
    }
  }
}

function draw() {
  background(50);
  
  fill(255);
  textSize(50);
  text(scores[player], 40, 55);
  textSize(10);
  text('TO', 32, 75);
  textSize(15);
  text(scores[(player+1)%2], 52, 75);
  
  textSize(30);
  text('Player ' + (player+1).toString(), 320, 48);
  textSize(15);
  if (player == turn) {
    text('Your turn', 343, 69);
  } else {
    if (turn !== -1) {
      text('Wait for Player ' + (turn+1).toString() + '\'s turn', 301, 69);
    }
  }

  try { board.update(-1, -1, undefined); } catch (e) { };
  try { rack.update(-1, -1, undefined); } catch (e) { };
}

function mouseMoved() {
  try { board.update(mouseX, mouseY, false); } catch (e) { };
  try { rack.update(mouseX, mouseY, false); } catch (e) { };
  return false;
}

function mousePressed() {
  try { rack.update(mouseX, mouseY, true); } catch (e) { };
  try { board.update(mouseX, mouseY, true); } catch (e) { };
  return false;
}
