const RACK_LEN = 7;
const RACK_SIZE = 50;
const RACK_PADDING = RACK_SIZE + 2;

let rackSelected = -1;

class Rack {

    constructor(rack) {
        this.x = 17.5;
        this.y = 580;
        this.startX = this.x;

        //this.selected = -1
        
        this.mouseX = -1;
        this.mouseY = -1;
        this.clicked = false;

        //this.rack = [this.letter('', -1), this.letter('', -1), this.letter('', -1),
         //   this.letter('', -1), this.letter('', -1), this.letter('', -1), this.letter('', -1)];

         this.rack = [{ letter: '', value: -1 }, { letter: '', value: -1 }, { letter: '', value: -1 }, 
            { letter: '', value: -1 }, { letter: '', value: -1 }, { letter: '', value: -1 }, { letter: '', value: -1 }];
    }

    letter(letter, value) {
        return { letter, value };
    }

    getRack() {
        return this.rack;
    }

    setRack(newRack) {
        this.rack = newRack;
    }

    update(mouseX, mouseY, clicked) {
        if (this.mouseX !== -1) this.mouseX = mouseX;
        if (this.mouseY !== -1) this.mouseY = mouseY;
        if (this.clicked !== undefined) this.clicked = clicked;

        this.clicked = this.draw(this.clicked);
    }

    draw(clicked) {
        this.x = this.startX;

        for (let i = 0; i < RACK_LEN; i++) {
            fill(255);
            if (i === rackSelected) {
                fill(100);
            }
            
            // check if rack item selected
            if (mouseX >= this.x && mouseX <= this.x + RACK_SIZE && 
                    mouseY >= this.y && mouseY <= this.y + RACK_SIZE) {

                if (clicked) {
                    rackSelected = i;
                }
                if (i !== rackSelected) {
                    fill(200);
                }           
            }
            if (this.rack[i][0].value > -1) {
                rect(this.x, this.y, RACK_SIZE, RACK_SIZE);
            }

            this.x += RACK_PADDING;
            
            fill(0);
            textSize(50);
            text(this.rack[i][0].letter, this.x - 33, this.y + 48);
            textSize(20);
            text(this.rack[i][0].value, this.x - 8, this.y + 18);
        }

        return false;
    }
    
}