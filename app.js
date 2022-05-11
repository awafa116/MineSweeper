const container = document.querySelector(".container");
const grid = document.querySelector(".grid");
const startWindow = document.querySelector(".start-container");
const resWindow = document.querySelector(".result-container");
let width = 6;
let height = 9;
let difficulty = "easy";
let bombAmount = 10;
let flagged = 0;
let squares = [];
let time = "";
let minutes = 0;
let seconds = 0;
let isStarted = false;
let isClickable = false;
let isStartable = true;

// Start Game widow
const sixBtn = document.getElementById("six-button");
const nineBtn = document.getElementById("nine-button");
const easyBtn = document.getElementById("easy-button");
const hardBtn = document.getElementById("hard-button");

// select size and difficulty :
// 6x9
sixBtn.addEventListener("click", () => {
  if (sixBtn.classList.contains("pushed")) return;
  if (!isStartable) return;
  sixBtn.classList.add("pushed");
  sixBtn.classList.remove("elevated");
  nineBtn.classList.add("elevated");
  nineBtn.classList.remove("pushed");
  width = 6;
  height = 9;
});
// 9x12
nineBtn.addEventListener("click", () => {
  if (nineBtn.classList.contains("pushed")) return;
  if (!isStartable) return;
  nineBtn.classList.add("pushed");
  nineBtn.classList.remove("elevated");
  sixBtn.classList.add("elevated");
  sixBtn.classList.remove("pushed");
  width = 9;
  height = 12;
});
// easy mode
easyBtn.addEventListener("click", () => {
  if (easyBtn.classList.contains("pushed")) return;
  if (!isStartable) return;
  easyBtn.classList.add("pushed");
  easyBtn.classList.remove("elevated");
  hardBtn.classList.add("elevated");
  hardBtn.classList.remove("pushed");
  difficulty = "easy";
});
// hard mode
hardBtn.addEventListener("click", () => {
  if (hardBtn.classList.contains("pushed")) return;
  if (!isStartable) return;
  hardBtn.classList.add("pushed");
  hardBtn.classList.remove("elevated");
  easyBtn.classList.add("elevated");
  easyBtn.classList.remove("pushed");
  difficulty = "hard";
});

// start game
const startBtn = document.querySelector(".start");
startBtn.addEventListener("click", () => {
  if (width === 6) {
    grid.setAttribute("class", "grid six");
    if (difficulty == "easy") {
      bombAmount = 10;
    } else if (difficulty == "hard") {
      bombAmount = 15;
    }
  } else if (width === 9) {
    grid.setAttribute("class", "grid nine");
    if (difficulty == "easy") {
      bombAmount = 16;
    } else if (difficulty == "hard") {
      bombAmount = 26;
    }
  }
  start();
});

function start() {
  if (!isStartable) return;
  if (!isStarted) startTimer();
  const bombCounter = document.querySelector(".bombs");
  bombCounter.innerText = bombAmount;
  // animating start window out
  const startTl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
  startTl.to(startWindow, { y: "3rem", opacity: 0 });
  startTl.set(startWindow, { display: "none" });
  isStartable = false;
  isClickable = true;
  isStarted = true;
  setTimeout(renderBoard, 800);
}

// Render Board
function renderBoard() {
  // Random bombs
  const grid = document.querySelector(".grid");
  const bombArr = Array(bombAmount).fill("bomb");
  const emptyArr = Array(width * height - bombAmount).fill("empty");
  const gameArr = bombArr.concat(emptyArr);
  const shuffledArr = shuffle(gameArr);

  // Create fields
  grid.innerHTML = "";
  for (let i = 0; i < width * height; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add("square", "elevated", shuffledArr[i]);
    grid.appendChild(square);
    squares.push(square);
    square.addEventListener("click", function () {
      if (!isClickable) return;
      click(square);
    });
  }

  // Fill fields with numbers
  for (let i = 0; i < squares.length; i++) {
    let number = 0;
    const isRightEdge = i % width === width - 1;
    const isLeftEdge = i % width === 0;

    if (squares[i].classList.contains("empty")) {
      // check LEFT field
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) number++;
      // check RIGHT field
      if (!isRightEdge && squares[i + 1].classList.contains("bomb")) number++;
      // check TOP field
      if (i > width - 1 && squares[i - width].classList.contains("bomb")) number++;
      // check TOP LEFT field
      if (i > width - 1 && !isLeftEdge && squares[i - width - 1].classList.contains("bomb"))
        number++;
      // check TOP RIGHT field
      if (i > width - 1 && !isRightEdge && squares[i - width + 1].classList.contains("bomb"))
        number++;
      // check BOTTOM field
      if (i < squares.length - width - 1 && squares[i + width].classList.contains("bomb")) number++;
      // check BOTTOM LEFT field
      if (
        i < squares.length - width - 1 &&
        !isLeftEdge &&
        squares[i + width - 1].classList.contains("bomb")
      )
        number++;
      // check BOTTOM RIGHT field
      if (
        i < squares.length - width - 1 &&
        !isRightEdge &&
        squares[i + width + 1].classList.contains("bomb")
      )
        number++;

      // print number into field
      squares[i].setAttribute("data", number);
    }
  }
  // animating
  const board = document.querySelector(".container");
  gsap.set(board, { display: "flex" });
  gsap.fromTo(
    board,
    { opacity: 0, y: "3rem" },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
  );
}

// Shuffle Array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// when click on field
function click(square) {
  const fieldId = square.id;
  if (square.classList.contains("pushed")) return;
  // if (square.classList.contains("flagged")) return;

  // change field style
  square.classList.add("pushed");
  square.classList.remove("elevated");

  // check for lose
  if (square.classList.contains("bomb")) {
    const bombs = document.querySelectorAll(".bomb");
    bombs.forEach(field => {
      field.innerHTML = '<i class="fa-solid fa-bomb"></i>';
      field.classList.add("pushed");
      field.classList.remove("elevated");
    });
    showResult("lose");
  } else {
    let number = square.getAttribute("data");
    if (number != 0) {
      if (number == 1) square.classList.add("one");
      else if (number == 2) square.classList.add("two");
      else square.classList.add("three");
      square.innerText = number;
    }
    // check for win
    const pushed = document.querySelectorAll(".pushed");
    if (width * height - pushed.length == bombAmount) showResult("win");
    checkNeighbor(square, fieldId);
  }
}

// check field's neighbors
function checkNeighbor(square, fieldId) {
  const isRightEdge = fieldId % width === width - 1;
  const isLeftEdge = fieldId % width === 0;
  let newId, newSquare;
  setTimeout(() => {
    // check LEFT field
    if (fieldId > 0 && !isLeftEdge) {
      newId = squares[parseInt(fieldId) - 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check RIGHT field
    if (fieldId > 0 && !isRightEdge) {
      newId = squares[parseInt(fieldId) + 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check TOP field
    if (fieldId > width - 1) {
      newId = squares[parseInt(fieldId) - width].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check TOP LEFT field
    if (fieldId > width - 1 && !isLeftEdge) {
      newId = squares[parseInt(fieldId) - width - 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check TOP RIGHT field
    if (fieldId > width - 1 && !isRightEdge) {
      newId = squares[parseInt(fieldId) - width + 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check BOTTOM field
    if (fieldId < squares.length - width - 1) {
      newId = squares[parseInt(fieldId) + width].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check BOTTOM LEFT field
    if (fieldId < squares.length - width - 1 && !isLeftEdge) {
      newId = squares[parseInt(fieldId) + width - 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
    // check BOTTOM RIGHT field
    if (fieldId < squares.length - width - 1 && !isRightEdge) {
      newId = squares[parseInt(fieldId) + width + 1].id;
      newSquare = document.getElementById(newId);
      if (newSquare.classList.contains("bomb")) return;
      click(newSquare);
    }
  }, 10);
}

function showResult(result) {
  const resTitle = document.querySelector(".result-title");
  const resTime = document.querySelector(".result-time");
  const playAgainBtn = document.querySelector(".play-again");
  // show result
  if (result === "win") {
    resTitle.innerText = "You Won!";
  } else {
    resTitle.innerText = "You Lost!";
  }
  resTime.innerText = time;

  const resTl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
  if (result === "lose") {
    resTl.fromTo(grid, { x: "1rem" }, { x: 0, duration: 1, ease: "elastic.out(1.5, 0.2)" });
  }
  resTl.to(container, { y: "3rem", opacity: 0 });
  resTl.set(container, { display: "none" });
  resTl.set(resWindow, { display: "block" });
  resTl.fromTo(resWindow, { y: "3rem", opacity: 0 }, { y: 0, opacity: 1 });

  // stop timer
  isStarted = false;
  minutes = 0;
  seconds = 0;

  // cick on play again
  playAgainBtn.addEventListener("click", playAgain);
}

function playAgain() {
  const againTl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
  againTl.to(resWindow, { y: "3rem", opacity: 0 });
  againTl.set(resWindow, { display: "none" });
  againTl.set(startWindow, { display: "block" });
  againTl.fromTo(startWindow, { y: "3rem", opacity: 0 }, { y: 0, opacity: 1 });
  setTimeout(() => {
    isStartable = true;
    squares = [];
  }, 1400);
}

// Timer functions
let timeInterval = setInterval(startTimer, 1000);
function startTimer() {
  if (!isStarted) return;
  const timer = document.querySelector(".time");
  if (seconds > 60) {
    minutes++;
    seconds = 0;
  }
  if (seconds < 10) {
    if (minutes < 10) {
      time = `0${minutes}:0${seconds}`;
    } else {
      time = `${minutes}:0${seconds}`;
    }
  } else {
    if (minutes < 10) {
      time = `0${minutes}:${seconds}`;
    } else {
      time = `${minutes}:${seconds}`;
    }
  }
  timer.innerText = time;
  seconds++;
}

// settings menu
const settingsBtn = document.querySelector(".settings");
const settingsMenu = document.querySelector(".settings-menu");
const body = document.querySelector("body");
const darkBtn = document.querySelector("#dark-mode-button");
const menuTl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.out" } });

// Open and Close settings menu
function closeMenu() {
  menuTl.fromTo(settingsMenu, { y: 0, opacity: 1 }, { y: "-1rem", opacity: 0 });
  menuTl.set(settingsMenu, { display: "none", duration: 0 });
  settingsMenu.classList.remove("opened");
}
function openMenu() {
  settingsMenu.classList.add("opened");
  menuTl.set(settingsMenu, { display: "flex", duration: 0 });
  menuTl.fromTo(settingsMenu, { y: "-1rem", opacity: 0 }, { y: 0, opacity: 1 });
}

// click on settings button
settingsBtn.addEventListener("click", () => {
  if (settingsMenu.classList.contains("opened")) {
    closeMenu();
    return;
  }
  openMenu();
});

// dark-mode toggle
darkBtn.addEventListener("click", () => {
  if (!settingsMenu.classList.contains("opened")) return;
  if (darkBtn.classList.contains("on")) {
    darkBtn.setAttribute("class", "off");
    body.setAttribute("class", "light");
  } else {
    body.setAttribute("class", "dark");
    darkBtn.setAttribute("class", "on");
  }
  setTimeout(closeMenu, 200);
});

// open About window
const aboutWindow = document.querySelector(".about-window");
const aboutBtn = document.querySelector(".about-btn");
const aboutClose = document.querySelector(".close-about");
const aboutTl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.out" } });

aboutBtn.addEventListener("click", () => {
  if (!settingsMenu.classList.contains("opened")) return;
  closeMenu();
  aboutTl.set(aboutWindow, { display: "block" });
  aboutTl.fromTo(aboutWindow, { y: "3rem", opacity: 0 }, { y: 0, opacity: 1 });
});

aboutClose.addEventListener("click", () => {
  aboutTl.fromTo(aboutWindow, { y: 0, opacity: 1 }, { y: "3rem", opacity: 0 });
  aboutTl.set(aboutWindow, { display: "none" });
});
