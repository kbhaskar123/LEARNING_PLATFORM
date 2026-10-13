document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const token = localStorage.getItem('token');

// Add course handler
document.getElementById('courseForm').onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const videoUrl = document.getElementById('videoUrl').value.trim();
  const paragraphs = document.getElementById('paragraphs').value.split('\n').filter(p=>p.trim().length);

  const res = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ title, description, videoUrl, paragraphs })
  });
  const data = await res.json();
  document.getElementById('courseMsg').textContent = res.ok ? 'Course Added!' : (data.msg || 'Error');
  if(res.ok){ document.getElementById('courseForm').reset(); loadCourses(); }
};

// Fetch + list all courses
async function loadCourses(){
  const res = await fetch('http://localhost:5000/api/courses', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const courses = await res.json();
  const list = document.getElementById('coursesList');
  list.innerHTML = '';
  if(Array.isArray(courses) && courses.length){
    courses.forEach(course => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${course.title}</strong>
        <button onclick="deleteCourse('${course._id}')" class="button" style="background:#f7cac9;color:#333;float:right;">Delete</button>
        <div>${course.description}</div>
        <small>${course.videoUrl ? 'Video: '+course.videoUrl : ''}</small>`;
      list.appendChild(li);
    });
  }else{
    list.innerHTML = '<li>No courses found.</li>';
  }
}

// Delete course
async function deleteCourse(id){
  if(!confirm('Delete this course?')) return;
  const res = await fetch('http://localhost:5000/api/courses/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  loadCourses();
}

// Load courses list on page load
window.onload = loadCourses;
