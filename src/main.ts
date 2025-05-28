const searchParams = new URLSearchParams(window.location.search);
const challengeMode = searchParams.has("challenge");
const debugMode = searchParams.has("debug");
const cheatMode = searchParams.has("cheat");

const primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
  113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
  241, 251, 257, 263, 269, 271,
];

const numInput = document.getElementById("numInput") as HTMLInputElement;
const numText = document.getElementById("number") as HTMLElement;
const countdownText = document.getElementById("countdown") as HTMLElement;

const debugScoreText = document.getElementById("debugScore") as HTMLElement;
const debugMistakesText = document.getElementById("debugMistakes") as HTMLElement;
const cheatText = document.getElementById("cheat") as HTMLElement;

const dialog = document.getElementById("endDialog") as HTMLDialogElement;
const dialogModeText = document.getElementById("modeText") as HTMLElement;
const dialogTotalText = document.getElementById("totalText") as HTMLElement;
const dialogMistakesText = document.getElementById("mistakesText") as HTMLElement;
const dialogScoreText = document.getElementById("scoreText") as HTMLElement;
const dialogReset = document.getElementById("resetButton") as HTMLButtonElement;

let score: number;
let scoreFromThisLevel: number;
let countdown: number;
let mistakes: number;
let currentNumber: bigint = BigInt(0);
let multiplyCount: number;
let minPrimeIndex: number;
let maxPrimeIndex: number;
let answerPrimes: number[];
let countdownInterval: number | undefined;

function reset() {
  score = 0;
  scoreFromThisLevel = 0;
  mistakes = 0;
  if (challengeMode) {
    countdown = 120;
    multiplyCount = 4;
    maxPrimeIndex = 10;
    minPrimeIndex = 4;
  } else {
    countdown = 90;
    multiplyCount = 3;
    maxPrimeIndex = 3;
    minPrimeIndex = 0;
  }
  prepare();
  update();

  dialog.close();

  clearInterval(countdownInterval);
  countdownText.innerText = countdown.toString();
  countdownInterval = setInterval(() => {
    countdown--;
    updateCountdown();
  }, 1000);

  createNumber();
}

function prepare() {
  answerPrimes = [];
  numInput.value = "";
}

function createNumber() {
  score += scoreFromThisLevel;
  scoreFromThisLevel = 1;
  currentNumber = BigInt(1);
  for (let i = 0; i < multiplyCount; i++) {
    let prime = primes[minPrimeIndex + Math.floor(Math.random() * (maxPrimeIndex - minPrimeIndex + 1))];
    answerPrimes.push(prime);
    currentNumber *= BigInt(prime);
  }
  answerPrimes.sort((a, b) => a - b);
  update();
}

function update() {
  numText.innerText = currentNumber.toString();
  if (debugMode) {
    debugScoreText.innerText = `Total: ${score} + ${scoreFromThisLevel}`;
    debugMistakesText.innerText = `Mistakes: ${mistakes}`;
  }
  if (cheatMode) {
    cheatText.innerText = answerPrimes.join(", ");
  }
  if (currentNumber === BigInt(1)) {
    prepare();
    multiplyCount += 0.5;
    maxPrimeIndex += 0.5;
    if (maxPrimeIndex >= primes.length - 1) {
      maxPrimeIndex = primes.length - 1;
    }
    createNumber();
  }
}

function updateCountdown() {
  if (countdown < 0) {
    clearInterval(countdownInterval);
    dialog.showModal();
    dialogModeText.innerText = challengeMode ? "Challenge Mode" : "";
    const total = score + scoreFromThisLevel;
    dialogTotalText.innerText = `Total: ${total}`;
    dialogMistakesText.innerText = `Mistakes: ${mistakes}`;
    const finalScore = challengeMode
      ? Math.floor(total / (mistakes * mistakes * mistakes * mistakes + 1))
      : Math.floor(total / Math.sqrt(mistakes + 1));
    dialogScoreText.innerText = `Final Score: ${finalScore}`;
    countdown = 0;
  }
  countdownText.innerText = countdown.toString();
}

reset();

numInput.addEventListener("keyup", (e) => {
  if (!e.repeat && e.key === "Enter" && countdown >= 0) {
    const num = Number.parseInt(numInput.value);
    if (Number.isInteger(num) && answerPrimes.includes(num)) {
      const index = answerPrimes.indexOf(num);
      answerPrimes.splice(index, 1);
      scoreFromThisLevel *= num;
      currentNumber /= BigInt(num);
    } else {
      mistakes++;
      if (challengeMode) {
        countdown -= 20;
        updateCountdown();
      }
    }
    update();
    numInput.value = "";
  }
});

document.addEventListener("keyup", (e) => {
  if (!e.repeat && e.key === "Escape") {
    reset();
  }
});

dialogReset.addEventListener("click", () => reset());
