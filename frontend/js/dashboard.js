document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  window.location.href = 'login.html';
};

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'login.html'; return; }
  try {
    const res = await fetch('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const user = await res.json();
    document.getElementById('userWelcome').innerHTML = `<h3>Hello, ${user.name} (${user.role})</h3>`;
    if (user.role === 'admin') {
      document.getElementById('adminPanel').style.display = '';
      document.getElementById('myCoursesSection').style.display = 'none';
    } else {
      document.getElementById('adminPanel').style.display = 'none';
      document.getElementById('myCoursesSection').style.display = '';
      const myCoursesList = document.getElementById('myCoursesList');
      myCoursesList.innerHTML = '';
      if (!user.courses || user.courses.length === 0) {
        myCoursesList.innerHTML = '<li>No courses enrolled.</li>';
      } else {
        user.courses.forEach(course => {
          if (course._id && course.title) {
            myCoursesList.innerHTML += `<li>
              <strong>${course.title}</strong>
              <p>${course.description}</p>
              <a class="button" href="course_detail.html?courseId=${course._id}">Open Course</a>
            </li>`;
          } else {
            myCoursesList.innerHTML += `<li>Invalid course data</li>`;
          }
        });
      }
    }
  } catch (err) {
    alert(err.message);
    window.location.href = 'login.html';
  }
}
window.onload = loadDashboard;
