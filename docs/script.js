let gameMode = "vscom";
let score1 = 0;
let score2 = 0;
let player1Choice = "";
let player2Choice = "";
let timeLeft = 30;
let timerId = null;
let canPlay = true;

function startTimer() {
  clearInterval(timerId);
  timeLeft = 30;
  canPlay = true;
  document.querySelector(".timer").classList.remove("warning");
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 5) {
      document.querySelector(".timer").classList.add("warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      canPlay = false;
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById("timeLeft").textContent = timeLeft;
}

function handleTimeUp() {
  const resultElement = document.getElementById("result");

  if (gameMode === "vscom") {
    if (!player1Choice) {
      player2Choice = ["batu", "gunting", "kertas"][
        Math.floor(Math.random() * 3)
      ];
      score2++;
      resultElement.textContent = "Waktu habis! Computer menang!";
    }
  } else {
    if (!player1Choice && !player2Choice) {
      resultElement.textContent = "Waktu habis! Kedua pemain belum memilih!";
    } else if (!player1Choice) {
      score2++;
      resultElement.textContent = "Waktu habis! Player 2 menang!";
    } else if (!player2Choice) {
      score1++;
      resultElement.textContent = "Waktu habis! Player 1 menang!";
    }
  }

  updateScores();
  player1Choice = "";
  player2Choice = "";

  setTimeout(() => {
    startTimer();
  }, 1500);
}

function updateScores() {
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function play(choice, player) {
  if (!canPlay || timeLeft <= 0) return;

  if (player === 1) {
    player1Choice = choice;
    if (gameMode === "vscom") {
      const choices = ["batu", "gunting", "kertas"];
      player2Choice = choices[Math.floor(Math.random() * 3)];
      canPlay = false;
      checkWinner();
      setTimeout(() => {
        startTimer();
      }, 1500);
    }
  } else if (gameMode === "2p") {
    player2Choice = choice;
    if (player1Choice) {
      canPlay = false;
      checkWinner();
      setTimeout(() => {
        startTimer();
      }, 1500);
    }
  }
}

function setMode(mode) {
  gameMode = mode;
  resetGame();
  document.getElementById("currentMode").textContent =
    `Mode: ${mode === "vscom" ? "VS Computer" : "2 Players"}`;
  document.getElementById("opponent").textContent =
    mode === "vscom" ? "Computer" : "Player 2";
  document.getElementById("player2Area").style.display =
    mode === "2p" ? "block" : "none";
  startTimer();
}

function checkWinner() {
  let result = "";
  if (player1Choice === player2Choice) {
    result = "Seri!";
  } else if (
    (player1Choice === "batu" && player2Choice === "gunting") ||
    (player1Choice === "gunting" && player2Choice === "kertas") ||
    (player1Choice === "kertas" && player2Choice === "batu")
  ) {
    result = "Player 1 Menang!";
    score1++;
  } else {
    result = `${gameMode === "vscom" ? "Computer" : "Player 2"} Menang!`;
    score2++;
  }

  document.getElementById("result").textContent =
    `Player 1 memilih ${player1Choice}, ${gameMode === "vscom" ? "Computer" : "Player 2"} memilih ${player2Choice}. ${result}`;

  const score1Element = document.getElementById("score1");
  const score2Element = document.getElementById("score2");

  score1Element.style.animation = "none";
  score2Element.style.animation = "none";

  void score1Element.offsetWidth;
  void score2Element.offsetWidth;

  score1Element.style.animation = "pulseOnChange 0.5s ease";
  score2Element.style.animation = "pulseOnChange 0.5s ease";

  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;

  player1Choice = "";
  player2Choice = "";
}

function resetGame() {
  score1 = 0;
  score2 = 0;
  player1Choice = "";
  player2Choice = "";
  document.getElementById("score1").textContent = "0";
  document.getElementById("score2").textContent = "0";
  document.getElementById("result").textContent = "";
  document.querySelector(".timer").classList.remove("warning");
  clearInterval(timerId);
  startTimer();
}

function updateButtonStates() {
  const buttons = document.querySelectorAll(".choices button");
  buttons.forEach((button) => {
    button.disabled = !canPlay;
  });
}

setInterval(updateButtonStates, 100);

window.onload = function () {
  startTimer();
};
