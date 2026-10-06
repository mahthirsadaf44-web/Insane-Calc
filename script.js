let display = document.getElementById("display");
let currentMode = "simple";

function addValue(value) {
  if (display.innerText === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function backspace() {
  let value = display.innerText.slice(0, -1);
  display.innerText = value || "0";
}

function addFunction(value) {
  if (display.innerText === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

function calculate() {
  let expression = display.innerText;

  try {
    expression = expression
      .replace(/π/g, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(");

    // x² and x³
    expression = expression.replace(
      /(\d+(?:\.\d+)?)\^2/g,
      "($1*$1)"
    );

    expression = expression.replace(
      /(\d+(?:\.\d+)?)\^3/g,
      "($1*$1*$1)"
    );

    // Basic safety check
    if (!/^[0-9+\-*/().,\sA-Za-z]+$/.test(expression)) {
      throw new Error();
    }

    let result = Function(
      '"use strict"; return (' + expression + ')'
    )();

    if (!Number.isFinite(result)) {
      throw new Error();
    }

    display.innerText = Number(result.toFixed(10));
  } catch {
    display.innerText = "Error";
  }
}

function setMode(mode) {
  currentMode = mode;

  document
    .getElementById("scientific")
    .classList.toggle("hidden", mode !== "scientific");

  document
    .getElementById("questions")
    .classList.toggle("hidden", mode !== "questions");

  document
    .getElementById("keypad")
    .classList.toggle("hidden", mode === "questions");

  if (mode === "questions") {
    newQuestion();
  }

  if (mode !== "questions") {
    clearDisplay();
  }
}

/* QUESTIONS */

let correctAnswer = 0;

function newQuestion() {
  let difficulty = document.getElementById("difficulty").value;
  let question = document.getElementById("question");

  let a, b;

  if (difficulty === "Easy") {
    a = random(1, 10);
    b = random(1, 10);

    correctAnswer = a + b;

    question.innerText = `${a} + ${b} = ?`;
  }

  else if (difficulty === "Medium") {
    a = random(10, 50);
    b = random(2, 15);

    correctAnswer = a * b;

    question.innerText = `${a} × ${b} = ?`;
  }

  else if (difficulty === "Hard") {
    a = random(20, 100);
    b = random(10, 50);

    correctAnswer = a * b - b;

    question.innerText = `${a} × ${b} − ${b} = ?`;
  }

  else if (difficulty === "Insane") {
    a = random(10, 30);
    b = random(5, 15);

    correctAnswer = a * a + b * b;

    question.innerText = `${a}² + ${b}² = ?`;
  }

  else {
    a = random(5, 20);
    b = random(2, 10);

    correctAnswer = Math.pow(a, 3) - Math.pow(b, 2);

    question.innerText = `${a}³ − ${b}² = ?`;
  }

  document.getElementById("answer").value = "";
  document.getElementById("result").innerText = "";
}

function checkAnswer() {
  let userAnswer = Number(
    document.getElementById("answer").value
  );

  let result = document.getElementById("result");

  if (userAnswer === correctAnswer) {
    result.innerText = "✅ Correct!";
  } else {
    result.innerText = "❌ Wrong! Try again.";
  }
}

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

/* KEYBOARD SUPPORT */

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if ("0123456789.+-*/()".includes(key)) {
    addValue(key);
  }

  if (key === "Enter") {
    calculate();
  }

  if (key === "Backspace") {
    backspace();
  }

  if (key === "Escape") {
    clearDisplay();
  }
});
