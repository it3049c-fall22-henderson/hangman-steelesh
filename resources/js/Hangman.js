class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a parameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    this.word = await this.getRandomWord(difficulty);
    // clear canvas
    this.clearCanvas();
    // draw base
    this.drawBase();
    // reset this.guesses to empty array
    this.guesses = [];
    // reset this.isOver to false
    this.isOver = false;
    // reset this.didWin to false
    this.didWin = false;
    next();
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    // Check if nothing was provided and throw an error if so
    if (letter === "") {
      alert("You must provide a letter - Input can not be null");
      throw Error("You must provide a letter - Input can not be null");
    }
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    if (!/^[a-zA-Z]*$/g.test(letter)) {
      alert(`You must provide a letter - "${letter}" is not a valid input`);
      throw Error(
        `You must provide a letter - "${letter}" is not a valid input`
      );
    }
    // Check if more than one letter was provided. throw an error if it is.
    if (letter.length > 1) {
      alert(`Must provide ONE letter - "${letter}" is not a valid input`);
      throw Error(`Must provide ONE letter - "${letter}" is not a valid input`);
    }
    // if it's a letter, convert it to lower case for consistency.
    letter = letter.toLowerCase();
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    if (!this.guesses.includes(letter)) {
      this.guesses.push(letter);
    } else {
      throw Error(`${letter} has been guessed already`);
    }
    // check if the word includes the guessed letter:
    if (this.word.includes(letter)) {
      //    if it's is call checkWin()
      this.checkWin();
    } else {
      //    if it's not call onWrongGuess()
      this.onWrongGuess();
    }
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    let remainingUnknowns = this.word.length;
    for (let i = 0; i < this.guesses.length; i++) {
      for (let j = 0; j < this.word.length; j++) {
        if (this.word.charAt(j) == this.guesses[i]) {
          remainingUnknowns--;
        }
      }
    }
    // if zero, set both didWin, and isOver to true
    if (remainingUnknowns === 0) {
      this.isOver = true;
      this.didWin = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    let wrongGuesses = 0;
    for (let i = 0; i < this.guesses.length; i++) {
      if (!this.word.includes(this.guesses[i])) {
        wrongGuesses++;
      }
    }
    if (wrongGuesses === 1) {
      this.drawHead();
    } else if (wrongGuesses === 2) {
      this.drawBody();
    } else if (wrongGuesses === 3) {
      this.drawLeftArm();
    } else if (wrongGuesses === 4) {
      this.drawRightArm();
    } else if (wrongGuesses === 5) {
      this.drawLeftLeg();
    } else if (wrongGuesses === 6) {
      this.drawRightLeg();
      this.isOver = true;
      this.didWin = false;
      console.log("Loss");
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the un-guessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    let placeholder = "";
    for (let i = 0; i < this.word.length; i++) {
      if (this.guesses.includes(this.word[i]) === true) {
        placeholder += `${this.word[i]} `;
      } else {
        placeholder += "_ ";
      }
    }
    return placeholder;
  }

  /**
   * This function returns a string of all the previous guesses, separated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return `Guesses: ${this.guesses.join(", ")}`;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(250, 95, 35, 0, Math.PI * 2, false);
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.beginPath();
    this.ctx.fillRect(249, 130, 2, 125);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.fillRect(185, 160, 65, 2);
  }

  drawRightArm() {
    this.ctx.fillRect(251, 160, 65, 2);
  }

  drawLeftLeg() {
    this.ctx.fillRect(185, 253, 65, 2);
  }

  drawRightLeg() {
    this.ctx.fillRect(251, 253, 65, 2);
  }
}
