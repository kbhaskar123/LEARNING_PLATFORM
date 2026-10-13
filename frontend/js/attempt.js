let quiz = null;
let currentIndex = 0;
let score = 0;
let totalSeconds = 300;
let timerInterval = null;
let quizEnded = false;

window.onload = async () => {
  enableProctoring();

  try {
    const quizId = localStorage.getItem("currentQuizId");
    if (!quizId) throw new Error("No quiz selected.");

    const res = await fetch("http://localhost:5000/api/quizzes");
    const allQuizzes = await res.json();

    quiz = allQuizzes.find(q => q._id === quizId);
    if (!quiz) throw new Error("Quiz not found from server.");

    document.getElementById("quiz-title").innerText =
      quiz.title || quiz.course?.title || "Quiz";

    startTimer();
    loadQuestion();

    document.getElementById("nextBtn").onclick = nextQuestion;
  } catch (err) {
    document.getElementById("question-box").innerHTML =
      `<p style="color:red; font-size:18px;">Error loading quiz: ${err.message}</p>`;
    document.getElementById("nextBtn").style.display = "none";
  }
};

// -----------------------------------------------
// LOAD QUESTION WITH INTERACTIVE UI
// -----------------------------------------------
function loadQuestion() {
  const q = quiz.questions[currentIndex];

  let html = `<div class='question-text'>${q.text}</div>`;

  q.options.forEach((opt, i) => {
    html += `
      <div class="option" onclick="selectOption(${i})" id="opt-${i}">
        ${opt}
      </div>
    `;
  });

  document.getElementById("question-box").innerHTML = html;

  updateProgress();
}

// HANDLE OPTION CLICK
let selectedOption = null;

function selectOption(i) {
  selectedOption = i;

  document.querySelectorAll(".option").forEach(opt => {
    opt.classList.remove("selected");
  });

  document.getElementById("opt-" + i).classList.add("selected");
}

// -----------------------------------------------
// NEXT BUTTON LOGIC
// -----------------------------------------------
function nextQuestion() {
  if (selectedOption === null) {
    alert("Please select an option.");
    return;
  }

  if (selectedOption === quiz.questions[currentIndex].answer) {
    score++;
  }

  selectedOption = null;
  currentIndex++;

  if (currentIndex < quiz.questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

// -----------------------------------------------
// END QUIZ
// -----------------------------------------------
function endQuiz() {
  quizEnded = true;
  clearInterval(timerInterval);

  document.querySelector(".quiz-container").innerHTML = `
    <h2 style="text-align:center; color:#2f80ed;">Quiz Completed!</h2>
    <h3 style="text-align:center;">Your Score: ${score} / ${quiz.questions.length}</h3>
    <button style="
      margin-top:20px; width:100%; padding:14px; background:#2f80ed; color:white; border-radius:12px; border:none; cursor:pointer;"
      onclick="location.href='quizzes.html'">
      Back to Quizzes
    </button>
  `;
}

// -----------------------------------------------
// PROGRESS BAR
// -----------------------------------------------
function updateProgress() {
  let percent = ((currentIndex) / quiz.questions.length) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
}

// -----------------------------------------------
// TIMER
// -----------------------------------------------
function startTimer() {
  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      alert("Time's up!");
      endQuiz();
      return;
    }

    totalSeconds--;

    let m = Math.floor(totalSeconds / 60);
    let s = totalSeconds % 60;

    document.getElementById("timer").innerText =
      `${m}:${s < 10 ? "0"+s : s}`;
  }, 1000);
}

// -----------------------------------------------
// PROCTORING
// -----------------------------------------------
function enableProctoring() {

  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("keydown", e => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I","C","J"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      alert("Developer tools are disabled!");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !quizEnded) {
      alert("Tab switching detected! Auto-submitting quiz.");
      endQuiz();
    }
  });

  // Force fullscreen
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && !quizEnded) {
      alert("Exited fullscreen! Auto-submitting quiz.");
      endQuiz();
    }
  });
}
