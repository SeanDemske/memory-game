const gameContainer = document.getElementById("game");
const cardsCollection = [];
const cardsFlippedDisplay = document.querySelector("#flipped-cards-display")
const bestScoreDisplay = document.querySelector("#best-score-display");
const playBtn = document.querySelector("#playBtn");
const restartBtn = document.querySelector("#restartBtn");
const playAgainBtn = document.querySelector("#playAgainBtn");
const cardsFlippedElement = document.querySelector("#cardsCounterElement");
const winModal = document.querySelector("#win-container");
const modalExitBtn = document.querySelector("#exit-button");
let flipByTwoCounter = 0; // Resets when two cards have been flipped
let bestScore = (localStorage.getItem("score") || 0);


let CARDS_FLIPPED = 0;
let GAME_WON = false;
const COLORS = [
  "red-back",
  "blue-back",
  "green-back",
  "orange-back",
  "purple-back",
  "red-back",
  "blue-back",
  "green-back",
  "orange-back",
  "purple-back"
];

const cardCheckArray = [];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // Card Container
    newDiv.classList.add("card-container");

    // scene for 3d card flip
    const sceneDiv = document.createElement("div");
    sceneDiv.classList.add("scene-div");
    sceneDiv.appendChild(newDiv);


    const newDivFront = document.createElement("div");
    newDivFront.classList.add("card-front");
    newDivFront.classList.add("card-face");
    newDiv.appendChild(newDivFront);

    const newDivBack = document.createElement("div");
    newDivBack.classList.add(color);
    newDivBack.classList.add("card-face");
    newDiv.appendChild(newDivBack);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // Add each card element to an array
    cardsCollection.push(sceneDiv);

    // append the div to the element with an id of game
    gameContainer.append(sceneDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if (event.target.parentElement.parentElement.classList.contains("clicked") || event.target.parentElement.parentElement.classList.contains("disabled")) { // If card has already been clicked, exit the function
    return;
  }

  // Update cards flipped display
  CARDS_FLIPPED++;
  cardsFlippedDisplay.innerText = CARDS_FLIPPED;


  // Match checking logic
  flipByTwoCounter++;
  if (flipByTwoCounter > 2) {                                             // Array full, reset and insert new card
    cardCheckArray.splice(0, cardCheckArray.length)
    cardCheckArray.push(event.target.nextElementSibling);
    flipByTwoCounter = 1;
  } else if (flipByTwoCounter === 2) {                                    // Two cards ready to be checked
    cardCheckArray.push(event.target.nextElementSibling);
    if (cardCheckArray[0].classList.item(0) !== cardCheckArray[1].classList.item(0)) {
      handleFail();
    }
  } else {                                                                // Insert first card into array
    cardCheckArray.push(event.target.nextElementSibling); 
  }

  event.target.parentElement.parentElement.classList.add("clicked"); // Flagging the element as clicked
  event.target.parentElement.classList.add("is-flipped") // CSS flip animation

  // Check to see if user has won
  GAME_WON = cardsCollection.every(function (card) {
    return card.classList.contains("clicked");
  });

  if (GAME_WON) handleWin();

}


function handleWin() {
  if (localStorage.getItem("score")) {
    if (Number(localStorage.getItem("score")) > CARDS_FLIPPED) {
      localStorage.setItem("score", CARDS_FLIPPED);
      bestScore = localStorage.getItem("score");
    }
  } else {
    localStorage.setItem("score", CARDS_FLIPPED);
    bestScore = localStorage.getItem("score");
  }
  setBestScore();
  updateView("win-screen");
}

function handleFail() {
  cardCheckArray.splice(0, cardCheckArray.length); // Empty array
  flipByTwoCounter = 0;
  for (let card of cardsCollection) { // Temporarily disable click events
    card.classList.add("disabled");
  }
  flipCardsToStartingOrientation();
}

function flipCardsToStartingOrientation() {
  setTimeout(() => {
    for (let card of cardsCollection) {
      card.classList.remove("disabled");
      card.classList.remove("clicked");
      card.firstElementChild.classList.remove("is-flipped");
    }
  }, 1000);
}

function setBestScore() {
  bestScoreDisplay.innerText = bestScore;
}

function updateView(gameState) {
  switch (gameState) {
    case 'mainmenu-screen':
      break;
    case 'play-screen':
      playBtn.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      restartBtn.classList.remove("hidden");
      cardsFlippedElement.classList.remove("hidden");
      winModal.classList.add("hidden");
      break;
    case 'win-screen':
      winModal.classList.remove("hidden");
      break;
    default:
      console.log("Error invalid argument");
  }
}

function restartGame() {
  updateView('play-screen');
  for (let card of cardsCollection) {
    card.remove();
  }
  cardsCollection.splice(0, cardsCollection.length);
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  cardCheckArray.splice(0, cardCheckArray.length); // Clear array
  CARDS_FLIPPED = 0;
  GAME_WON = false;
  flipByTwoCounter = 0
  cardsFlippedDisplay.innerText = CARDS_FLIPPED;
  for (let card of cardsCollection) {
    card.classList.remove("disabled");
    card.classList.remove("clicked");
    card.firstElementChild.classList.remove("is-flipped");
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
setBestScore();

// Event Listeners
playBtn.addEventListener('click', () => {
  updateView("play-screen");
})

modalExitBtn.addEventListener('click', () => {
  winModal.classList.add("hidden");
})

restartBtn.addEventListener('click', restartGame);

playAgainBtn.addEventListener('click', restartGame);