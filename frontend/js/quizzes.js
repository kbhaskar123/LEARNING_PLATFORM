const quizzesList = document.getElementById("quizzesList");

async function fetchQuizzes() {
  try {
    const response = await fetch("http://localhost:5000/api/quizzes");
    if (!response.ok) throw new Error('API error ' + response.status);
    const quizzes = await response.json();
    displayQuizzes(quizzes);
  } catch (err) {
    console.error(err);
    quizzesList.innerHTML = "<li>Failed to load quizzes</li>";
  }
}

function displayQuizzes(quizzes) {
  quizzesList.innerHTML = "";

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    quizzesList.innerHTML = "<li>No quizzes available.</li>";
    return;
  }

  quizzes.forEach((quiz, index) => {
    const li = document.createElement("li");
    li.classList.add("quiz-card");

    const courseName = quiz.course?.title ||
      (typeof quiz.course === 'string' ? quiz.course : "Unknown Course");

    li.innerHTML = `
      <div class="quiz-title">
        ${index + 1} – ${courseName}
      </div>

      <button class="attempt-btn" onclick="attemptQuiz('${quiz._id}')">
        Attempt Quiz
      </button>
    `;

    quizzesList.appendChild(li);
  });
}


function attemptQuiz(quizId) {
  localStorage.setItem("currentQuizId", quizId);
  window.location.href = "attempt_quiz.html";
}

fetchQuizzes();
