const TILES = 15;
const TILE_SIZE = 24;
const TILE_PADDING = TILE_SIZE + 1;

let boardSelectedX = -1;
let boardSelectedY = -1;

let powerup = '';

class Board {

    constructor() {
        this.x = 11.5;
        this.y = 100;
        this.startX = this.x;
        this.startY = this.y;

        this.letterPowerUp = 0;
        this.wordPowerUp = 0;

        let board = new Array(TILES);
        this.boardContent = new Array(TILES);

        for (let i = 0; i < TILES; i++) {
            board[i] = new Array(TILES);
            this.boardContent[i] = new Array(TILES);
            for (let j = 0; j < TILES; j++) {

                board[i][j] = new Tile('', 0, 0);

                if (i === 7 && j === 7) {
                } else if (i === j || i === (TILES - 1 - j)) {
                  if (i === 0 || i === (TILES-1)) {
                    powerup = '3W';
                  } else if (i === 6 || i === 8) {
                    powerup = '2L';
                  } else if (i === 5 || i === 9) {
                    powerup = '3L';
                  } else {
                    powerup = '2W';
                  }
                } else if (i === 0 || j === 0 || i === (TILES-1) || j === (TILES-1)) {
                  if (i === 7 || j === 7) {
                    powerup = '3W';
                  } else if (i === 3 || j === 3 || i === (TILES-4) || j === (TILES-4)) {
                    powerup = '2L';
                  } else {
                    powerup = '';
                  }
                } else if (i === 1 || j === 1 || i === (TILES-2) || j === (TILES-2)) {
                  if (i === 5 || j === 5 || i === 9 || j === 9) {
                    powerup = '3L';
                  } else {
                    powerup = '';
                  }
                } else if (i === 2 || j === 2 || i === (TILES-3) || j === (TILES-3)) {
                  if (i === 6 || j === 6 || i === 8 || j === 8) {
                    powerup = '2L';
                  } else {
                    powerup = '';
                  }
                } else if (i === 3 || j === 3 || i === (TILES-4) || j === (TILES-4)) {
                  if (i === 7 || j === 7) {
                    powerup = '2L';
                  } else {
                    powerup = '';
                  }
                } else {
                  powerup = '';
                }


                this.boardContent[i][j] = { letter: '', value: undefined, confirmed: false, 
                  blank: false, powerup: powerup };
            }
        }

        document.getElementById('reset').onclick = () => {
            this.resetClicked();
        }

        ref.on('value', (data) => { 
            try {
                this.boardContent = JSON.parse(data.val().board)
            } catch (e) {

            };
        });
    }
    
    resetClicked() {
      tempScore = 0;

      for (let i = 0; i < TILES; i++) {
        for (let j = 0; j < TILES; j++) {

          if (!this.boardContent[i][j].confirmed) {
            for (let a = 0; a < RACK_LEN; a++) {
              if (rack.rack[a][0].value === undefined) {
                rack.rack[a][0] = this.boardContent[i][j];
                rack.rack[a][0].powerup = '';
                if (rack.rack[a][0].blank) {
                  rack.rack[a][0].letter = '';
                }
                break;
              }
            }

            // MAKE SURE IT ONLY REMOVES MOVES FROM CURRENT TURN LATER ON
            this.boardContent[i][j] = { letter: '', value: undefined, confirmed: false, 
              blank: false, powerup: this.boardContent[i][j].powerup };
          }
        }
      }
    }

    update(mouseX, mouseY, clicked) {
        if (mouseX !== -1) this.mouseX = mouseX;
        if (mouseY !== -1) this.mouseY = mouseY;
        if (clicked !== undefined) this.clicked = clicked;

        this.clicked = this.draw(this.clicked);
    }

    draw(clicked) {
        this.x = this.startX;
        this.y = this.startY;
        
        for (let i = 0; i < TILES; i++) {
            for (let j = 0; j < TILES; j++) {
                fill(255);

                // check if rack item selected
                if (mouseX >= this.x && mouseX <= this.x + TILE_SIZE && 
                    mouseY >= this.y && mouseY <= this.y + TILE_SIZE) {

                    if (rightClick && !this.boardContent[i][j].confirmed) {
                        rackSelected = -1;

                        for (let a = 0; a < RACK_LEN; a++) {
                            if (rack.rack[a][0].value === undefined) {
                              tempScore -= this.boardContent[i][j].value;
                              rack.rack[a][0] = this.boardContent[i][j];
                              rack.rack[a][0].powerup = '';
                              if (rack.rack[a][0].blank) {
                                rack.rack[a][0].letter = '';
                              }
                              break;
                            }
                        }
                        this.boardContent[i][j] = { letter: '', value: undefined, confirmed: false, 
                          blank: false, powerup: this.boardContent[i][j].powerup };

                        rightClick = false;
                    } else {
                        if (clicked && !this.boardContent[i][j].value) {
                            //rackSel2ected = i;
                            if (rackSelected !== -1) {
                                boardSelectedX = i;
                                boardSelectedY = j;
                            }
                            
                            if (rackSelected !== -1) {
                              // blank letters
                              let blankLetter = ''
                              if (rack.rack[rackSelected][0].blank) {
                                while (blankLetter === '') {
                                  blankLetter = prompt('Enter any letter');
                                  console.log(blankLetter.length === 1)
                                  console.log(blankLetter.match(/^[a-zA-Z]+$/))
                                  if (blankLetter.length === 1 && blankLetter.match(/^[a-zA-Z]+$/)) {
                                    
                                  } else {
                                    blankLetter = '';
                                  }
                                }
                              }


                              let tempPowerup = this.boardContent[i][j].powerup;
                              this.boardContent[i][j] = rack.rack[rackSelected][0];
                              this.boardContent[i][j].powerup = tempPowerup;
                              if (blankLetter !== '') {
                                this.boardContent[i][j].letter = blankLetter.toUpperCase();
                              }
  
                              rack.rack[rackSelected][0] = { letter: '', value: undefined };
                              rackSelected = -1;
                            }
                        }
                        //if (i !== rackSelected) {
                        //    fill(200);
                        //}           

                    }

                }

                let powerupText = '';
                textSize(10);
                if (i === 7 && j === 7) {
                  fill(200);
                } else if (i === j || i === (TILES - 1 - j)) {
                  if (i === 0 || i === (TILES-1)) {
                    fill(250, 50, 50); // red
                    powerupText = 'TW';
                  } else if (i === 6 || i === 8) {
                    fill(210, 230, 255); // light blue
                    powerupText = 'DL';
                  } else if (i === 5 || i === 9) {
                    fill(160, 150, 255); // dark blue
                    powerupText = 'TL';
                  } else {
                    fill(255, 180, 180); // pink
                    powerupText = 'DW';
                  }
                } else if (i === 0 || j === 0 || i === (TILES-1) || j === (TILES-1)) {
                  if (i === 7 || j === 7) {
                    fill(250, 50, 50); // red
                    powerupText = 'TW'; 
                  } else if (i === 3 || j === 3 || i === (TILES-4) || j === (TILES-4)) {
                    fill(210, 230, 255); // light blue
                    powerupText = 'DL';
                  } else powerupText = '';
                } else if (i === 1 || j === 1 || i === (TILES-2) || j === (TILES-2)) {
                  if (i === 5 || j === 5 || i === 9 || j === 9) {
                    fill(160, 150, 255); // dark blue
                    powerupText = 'TL';
                  } else powerupText = '';
                } else if (i === 2 || j === 2 || i === (TILES-3) || j === (TILES-3)) {
                  if (i === 6 || j === 6 || i === 8 || j === 8) {
                    fill(210, 230, 255); // light blue
                    powerupText = 'DL';
                  } else powerupText = '';
                } else if (i === 3 || j === 3 || i === (TILES-4) || j === (TILES-4)) {
                  if (i === 7 || j === 7) {
                    fill(210, 230, 255); // light blue
                    powerupText = 'DL';
                  } else powerupText = '';
                }

                rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
                
                fill(0);
                textSize(20);
                text(this.boardContent[i][j].letter, this.x + 10, this.y + 21);
                textSize(11);
                text(this.boardContent[i][j].value, this.x + 20.5, this.y + 10);
                textSize(13);
                if (this.boardContent[i][j].value === undefined) {
                  text(powerupText, this.x+12.5, this.y+17);
                }
                
                this.x += TILE_PADDING;
            }
            this.x = this.startX;
            this.y += TILE_PADDING;
        }

        return false;
    }

}