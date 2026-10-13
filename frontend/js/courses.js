// =====================
// Logout button
// =====================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };
}

// =====================
// DOM Elements
// =====================
const coursesList = document.getElementById('coursesList');
const searchInput = document.getElementById('searchInput');

// =====================
// Token (used for enroll only)
// =====================
const token = localStorage.getItem('token');

// =====================
// Video Embed Helper
// =====================
function getVideoEmbedHTML(videoUrl) {
  if (!videoUrl) return "";

  // Regular YouTube URL
  if (videoUrl.includes("youtube.com/watch?v=")) {
    const embedUrl = videoUrl.replace("watch?v=", "embed/").split("&")[0];
    return `<iframe width="320" height="180" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  }

  // Short YouTube URL
  const youtuMatch = videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuMatch) {
    return `<iframe width="320" height="180" src="https://www.youtube.com/embed/${youtuMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
  }

  // .mp4 local video
  if (videoUrl.endsWith(".mp4")) {
    return `<video width="320" height="180" controls src="${videoUrl}"></video>`;
  }

  // Fallback
  return `<iframe width="320" height="180" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
}

// =====================
// GET all Courses
// =====================
async function fetchCourses(search = "") {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  try {
    const response = await fetch(`http://localhost:5000/api/courses?${params.toString()}`);

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    displayCourses(data);
  } catch (err) {
    console.error(err);
    coursesList.innerHTML = "<li>Error loading courses</li>";
  }
}

// =====================
// Display Courses
// =====================
function displayCourses(courses) {
  coursesList.innerHTML = "";

  if (!courses.length) {
    coursesList.innerHTML = "<li>No courses found.</li>";
    return;
  }

  courses.forEach(course => {
    // ✅ Use first lesson to preview video
    const firstLesson = course.lessons?.[0];
    const videoEmbed = firstLesson ? getVideoEmbedHTML(firstLesson.videoUrl) : "";

    const li = document.createElement("li");
    li.innerHTML = `
      <h3 style="color:#2f80ed;">${course.title}</h3>
      <p>${course.description}</p>
      ${videoEmbed}
      
      <button onclick="addCourse('${course._id}')" class="button">Add to My Courses</button>
      <br/><br/>
      <a href="course_detail.html?id=${course._id}" style="color:blue;text-decoration:underline;">View Course</a>
    `;

    coursesList.appendChild(li);
  });
}

// =====================
// Enroll course
// =====================
async function addCourse(courseId) {
  if (!token) {
    alert("You must be logged in to enroll!");
    return (window.location.href = "login.html");
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/enroll/${courseId}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg || "Course added!");
    } else {
      alert(data.msg || "Failed: " + res.status);
    }
  } catch (err) {
    alert("Error enrolling");
  }
}

// =====================
// Search
// =====================
searchInput.addEventListener("input", () => {
  fetchCourses(searchInput.value.trim());
});

// =====================
// On Load
// =====================
window.onload = () => fetchCourses();
