document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const token = localStorage.getItem('token');

document.getElementById('quizForm').onsubmit = async (e) => {
  e.preventDefault();
  const courseId = document.getElementById('courseId').value.trim();
  const questionText = document.getElementById('question').value.trim();
  const options = [
    document.getElementById('option1').value.trim(),
    document.getElementById('option2').value.trim(),
    document.getElementById('option3').value.trim(),
    document.getElementById('option4').value.trim()
  ];
  const answer = parseInt(document.getElementById('answer').value);

  const res = await fetch('http://localhost:5000/api/quizzes', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization':'Bearer '+token
    },
    body: JSON.stringify({
      course: courseId,
      questions: [{ text: questionText, options, answer }]
    })
  });
  const data = await res.json();
  document.getElementById('quizMsg').textContent = res.ok ? 'Quiz Added!' : (data.msg || 'Error');
  if(res.ok){ document.getElementById('quizForm').reset(); loadQuizzes(); }
};

async function loadQuizzes(){
  const res = await fetch('http://localhost:5000/api/quizzes');
  const quizzes = await res.json();
  const list = document.getElementById('quizzesList');
  list.innerHTML = '';
  if(Array.isArray(quizzes) && quizzes.length){
    quizzes.forEach(quiz => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>Quiz for Course ${quiz.course}</strong>
        <button onclick="deleteQuiz('${quiz._id}')" class="button" style="background:#f7cac9;color:#333;float:right;">Delete</button>`;
      quiz.questions.forEach((q, idx) => {
        li.innerHTML += `<div>Q${idx+1}: ${q.text}</div>
          <div>Options: ${q.options.join(', ')}</div>
          <div>Answer: Option ${q.answer + 1}</div>`;
      });
      list.appendChild(li);
    });
  }else{
    list.innerHTML = '<li>No quizzes found.</li>';
  }
}

async function deleteQuiz(id){
  if(!confirm('Delete this quiz?')) return;
  const res = await fetch('http://localhost:5000/api/quizzes/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  loadQuizzes();
}

window.onload = loadQuizzes;
