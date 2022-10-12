// START + DIFFICULTY SELECTION
const startWrapper = document.getElementById(`startWrapper`);
const difficultySelectForm = document.getElementById(`difficultySelect`);
const difficultySelect = document.getElementById(`difficulty`);

// GAME
const gameWrapper = document.getElementById(`gameWrapper`);
const guessesText = document.getElementById(`guesses`);
const wordHolderText = document.getElementById(`wordHolder`);

// GUESSING FORM
const guessForm = document.getElementById(`guessForm`);
const guessInput = document.getElementById(`guessInput`);
const guessButton = document.getElementById(`guessSubmitButton`);
// GAME RESET BUTTON
const resetGame = document.getElementById(`resetGame`);

// CANVAS
let canvas = document.getElementById(`hangmanCanvas`);

// The following Try-Catch Block will catch the errors thrown
try {
  // Instantiate a game Object using the Hangman class.
  const game = new Hangman(canvas);
  // add a submit Event Listener for the to the difficultySelectionForm
  difficultySelectForm.addEventListener(`submit`, function (event) {
    event.preventDefault();
    //    get the difficulty input
    let gameDifficulty = difficultySelect.value;
    //    call the game start() method, the callback function should do the following
    game.start(gameDifficulty, function () {
      event.preventDefault();
      //       1. hide the startWrapper
      startWrapper.classList.add("hidden");
      //       2. show the gameWrapper
      gameWrapper.classList.remove("hidden");
      //       3. call the game getWordHolderText and set it to the wordHolderText
      wordHolderText.innerHTML = game.getWordHolderText();
      //       4. call the game getGuessesText and set it to the guessesText
      guessesText.innerHTML = game.getGuessesText();
    });
  });

  // add a submit Event Listener to the guessForm
  guessForm.addEventListener(`submit`, function (e) {
    e.preventDefault();
    //    get the guess input
    let input = guessInput.value;
    //    call the game guess() method
    game.guess(input);
    //    set the wordHolderText to the game.getHolderText
    wordHolderText.innerHTML = game.getWordHolderText();
    //    set the guessesText to the game.getGuessesText
    guessesText.innerHTML = game.getGuessesText();
    //    clear the guess input field
    guessInput.value = "";
    // Given the Guess Function calls either the checkWin or the onWrongGuess methods
    // the value of the isOver and didWin would change after calling the guess() function.
    // Check if the game isOver:
    if (game.isOver === true) {
      //      1. disable the guessInput
      guessInput.disabled = true;
      //      2. disable the guessButton
      guessButton.disabled = true;
      //      3. show the resetGame button
      resetGame.classList.remove("hidden");
      // if the game is won or lost, show an alert.
      if (game.didWin === true) {
        alert("Congratulations! You won the game!");
      } else {
        alert("Sorry, you lost!");
      }
    }
  });

  // add a click Event Listener to the resetGame button
  resetGame.addEventListener(`click`, function (e) {
    e.preventDefault();
    //    show the startWrapper
    startWrapper.classList.remove("hidden");
    //    hide the gameWrapper
    gameWrapper.classList.add("hidden");
    // Reset previous game stats
    location.reload();
  });
} catch (error) {
  console.error(error);
  alert(error);
}
