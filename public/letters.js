class Letters {

    constructor() {
        this.letters = new Array(100);
        this.fillLetterBank();

        ref.on('value', (data) => {
            try {
                this.letters = JSON.parse(data.val().letters);
            } catch (e) {};
        });
    }

    fillLetterBank() {
        this.index = 0;

        this.fillPerLetter(' ', 0, 2, true);
        this.fillPerLetter('E', 1, 12, false);
        this.fillPerLetter('A', 1, 9, false);
        this.fillPerLetter('I', 1, 9, false);
        this.fillPerLetter('O', 1, 8, false);
        this.fillPerLetter('N', 1, 6, false);
        this.fillPerLetter('R', 1, 6, false);
        this.fillPerLetter('T', 1, 6, false);
        this.fillPerLetter('L', 1, 4, false);
        this.fillPerLetter('S', 1, 4, false);
        this.fillPerLetter('U', 1, 4, false);
        this.fillPerLetter('D', 2, 4, false);
        this.fillPerLetter('G', 2, 3, false);
        this.fillPerLetter('B', 3, 2, false);
        this.fillPerLetter('C', 3, 2, false);
        this.fillPerLetter('M', 3, 2, false);
        this.fillPerLetter('P', 3, 2, false);
        this.fillPerLetter('F', 4, 2, false);
        this.fillPerLetter('H', 4, 2, false);
        this.fillPerLetter('V', 4, 2, false);
        this.fillPerLetter('W', 4, 2, false);
        this.fillPerLetter('Y', 4, 2, false);
        this.fillPerLetter('K', 5, 1, false);
        this.fillPerLetter('J', 8, 1, false);
        this.fillPerLetter('X', 8, 1, false);
        this.fillPerLetter('Q', 10, 1, false);
        this.fillPerLetter('Z', 10, 1, false);
    }

    fillPerLetter(letter, value, reps, blank) {
        for (let i = 0; i < reps; i++) {
          this.letters[this.index + i] = this.letter(letter, value, false, blank);
        }
        this.index += reps;
    }

    letter(letter, value, confirmed, blank) {
        return { letter, value, confirmed, blank };
    }

    add(rack) {
        for (let i = 0; i < RACK_LEN; i++) {
          if (this.letters.length > 0) {
            try {
              if (rack[i][0].value === undefined) {
                console.log(rack);
                rack[i] = this.letters.splice(int(random(0, this.letters.length)), 1);
              }
            } catch (e) {
              rack[i] = this.letters.splice(int(random(0, this.letters.length)), 1);
            }
          }
        }

        return rack;
    }

}