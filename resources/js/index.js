const startWrapper = document.getElementById(`startWrapper`);
const difficultySelectForm = document.getElementById(`difficultySelect`);
const difficultySelect = document.getElementById(`difficulty`);
const gameWrapper = document.getElementById(`gameWrapper`);
const guessesText = document.getElementById(`guesses`);
const wordHolderText = document.getElementById(`wordHolder`);
const guessForm = document.getElementById(`guessForm`);
const guessInput = document.getElementById(`guessInput`);
const guessButton = document.getElementById(`guessSubmitButton`);
const resetGame = document.getElementById(`resetGame`);
let canvas = document.getElementById(`hangmanCanvas`);
const nameInput = document.getElementById(`my-name-input`);
const saveNameForm = document.getElementById(`nameInput`);
const saveNameBtn = document.getElementById(`save`);
const startGameBtn = document.getElementById(`start`);

try {
  const game = new Hangman(canvas);

  $(nameInput).keyup(function () {
    if ($(this).val().length != 0) {
      saveNameBtn.disabled = false;
      saveNameBtn.style.backgroundColor = "#007BFF";
      saveNameBtn.style.color = "#fff";
    } else {
      saveNameBtn.disabled = true;
      saveNameBtn.style.backgroundColor = "#fff";
      saveNameBtn.border = "1px solid gray";
      saveNameBtn.style.color = "gray";
    }
  });
  saveNameBtn.addEventListener(`click`, function (event) {
    if (nameInput.value === "") {
      alert(`User must enter a name`);
      throw Error(`User must enter a name`);
    } else if (!/^[A-Za-z\s]*$/.test(nameInput.value)) {
      alert(`Must be a valid name - "${nameInput.value}" is not a valid input`);
      throw Error(
        `Must be a valid name - "${nameInput.value}" is not a valid input`
      );
    } else {
      sessionStorage.setItem("Name", nameInput.value);
      nameInput.innerHTML = nameInput.value;
      saveNameBtn.value = "Saved!";
      saveNameBtn.style.color = "white";
      saveNameBtn.style.backgroundColor = "#28A745";
      saveNameBtn.style.border = "1px solid gray";
      difficultySelect.disabled = false;
      $(nameInput).keyup(function () {
        if ($(this).val().length != 0) {
          saveNameBtn.value = `Modify current name (${sessionStorage.getItem(
            "Name"
          )})`;
          saveNameBtn.style.backgroundColor = "#FFC107";
          saveNameBtn.style.color = "#fff";
          difficultySelect.value = "Select Difficulty";
          difficultySelect.disabled = true;
          startGameBtn.disabled = true;
        } else {
          saveNameBtn.value = "modify";
          saveNameBtn.disabled = true;
          saveNameBtn.style.backgroundColor = "#fff";
          saveNameBtn.border = "1px solid gray";
          saveNameBtn.style.color = "gray";
          difficultySelect.value = "Select Difficulty";
          difficultySelect.disabled = true;
          startGameBtn.disabled = true;
        }
      });
    }
  });

  $(difficultySelect).change(function () {
    var theVal = $(this).val();
    switch (theVal) {
      case "Select Difficulty":
        startGameBtn.disabled = true;
        break;
      case "easy":
        startGameBtn.disabled = false;
        break;
      case "medium":
        startGameBtn.disabled = false;
        break;
      case "hard":
        startGameBtn.disabled = false;
        break;
    }
  });

  startGameBtn.addEventListener(`click`, function (event) {
    if (
      difficultySelect.selectedIndex === 0 &&
      sessionStorage.getItem("Name") == null
    ) {
      alert(`Must save a name AND choose a difficulty to start the game`);
      throw Error(`Must save a name AND choose a difficulty to start the game`);
    } else if (sessionStorage.getItem("Name") == null) {
      alert(`Must save a name to start the game`);
      throw Error(`Must save a name to start the game`);
    } else if (difficultySelect.selectedIndex === 0) {
      alert(`Must select a game difficulty`);
      throw Error(`Must select a game difficulty`);
    } else {
      event.preventDefault();
      let gameDifficulty = difficultySelect.value;
      game.start(gameDifficulty, function () {
        event.preventDefault();
        startWrapper.classList.add("hidden");
        gameWrapper.classList.remove("hidden");
        wordHolderText.innerHTML = game.getWordHolderText();
        guessesText.innerHTML = game.getGuessesText();
      });
    }
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
window.onload = function () {
  difficultySelect.selectedIndex = 0;
  difficultySelect.disabled = true;
  saveNameBtn.disabled = true;
  startGameBtn.disabled = true;
  nameInput.value = "";
  sessionStorage.clear();
};
