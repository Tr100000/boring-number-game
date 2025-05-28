const primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
  113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
  241, 251, 257, 263, 269, 271,
];

const numInput = document.getElementById("numInput") as HTMLInputElement;
const numText = document.getElementById("number")!;
const countdownText = document.getElementById("countdown")!;

const dialog = document.getElementById("endDialog") as HTMLDialogElement;
const dialogTotalText = document.getElementById("totalText") as HTMLButtonElement;
const dialogMistakesText = document.getElementById("mistakesText") as HTMLButtonElement;
const dialogScoreText = document.getElementById("scoreText") as HTMLButtonElement;
const dialogReset = document.getElementById("resetButton") as HTMLButtonElement;

let score: number;
let scoreFromThisLevel: number;
let countdown: number;
let mistakes: number;
let currentNumber: bigint = BigInt(0);
let multiplyCount: number;
let maxPrimeIndex: number;
let answerPrimes: number[];
let countdownInterval: number | undefined;

function reset() {
  score = 0;
  scoreFromThisLevel = 0;
  countdown = 90;
  mistakes = 0;
  multiplyCount = 3;
  maxPrimeIndex = 3;
  prepare();
  update();

  dialog.close();

  clearInterval(countdownInterval);
  countdownText.innerText = countdown.toString();
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      dialog.showModal();
      dialogTotalText.innerText = `Total: ${score + scoreFromThisLevel}`;
      dialogMistakesText.innerText = `Mistakes: ${mistakes}`;
      dialogScoreText.innerText = `Final Score: ${Math.floor((score + scoreFromThisLevel) / Math.sqrt(mistakes + 1))}`;
      countdown = 0;
    }
    countdownText.innerText = countdown.toString();
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
    let prime = primes[Math.floor(Math.random() * (maxPrimeIndex + 1))];
    answerPrimes.push(prime);
    currentNumber *= BigInt(prime);
  }
  answerPrimes.sort((a, b) => a - b);
  update();
}

function update() {
  numText.innerText = currentNumber.toString();
  console.log(score + scoreFromThisLevel);
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

reset();

numInput.addEventListener("keyup", (e) => {
  if (!e.repeat && e.key === "Enter" && countdown >= 0) {
    const num = Number.parseInt(numInput.value);
    if (Number.isInteger(num) && answerPrimes.includes(num)) {
      const index = answerPrimes.indexOf(num);
      answerPrimes.splice(index, 1);
      scoreFromThisLevel *= num;
      currentNumber /= BigInt(num);
      update();
    } else {
      mistakes++;
    }
    numInput.value = "";
  }
});

document.addEventListener("keyup", (e) => {
  if (!e.repeat && e.key === "Escape") {
    reset();
  }
});

dialogReset.addEventListener("click", () => reset());
