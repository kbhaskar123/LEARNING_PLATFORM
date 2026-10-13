const courseDetailSection = document.getElementById("courseDetail");

// Get course ID from URL (supports both ?id= and ?courseId=)
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id") || urlParams.get("courseId");

// =============================
// Video embed helper
// =============================
function getVideoEmbedHTML(videoUrl) {
  if (!videoUrl) return "<p>No video available</p>";

  if (videoUrl.includes("watch?v=")) {
    videoUrl = videoUrl.replace("watch?v=", "embed/");
  }

  const ytShort = videoUrl.match(/youtu\.be\/(.+)/);
  if (ytShort) {
    videoUrl = "https://www.youtube.com/embed/" + ytShort[1];
  }

  if (videoUrl.endsWith(".mp4")) {
    return `<video width="100%" height="400" controls src="${videoUrl}" style="border-radius:10px;"></video>`;
  }

  return `<iframe width="100%" height="400" src="${videoUrl}" allowfullscreen style="border-radius:10px;"></iframe>`;
}

// =============================
// Load Course from backend
// =============================
async function loadCourse() {
  try {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
    const course = await res.json();

    if (!course || !course._id) {
      courseDetailSection.innerHTML = "<h2>❌ Course Not Found</h2>";
      return;
    }

    renderCourse(course);

  } catch (err) {
    courseDetailSection.innerHTML = "<h2>Error loading course</h2>";
  }
}

// =============================
// Render course inside <section>
// =============================
function renderCourse(course) {
  const lessons = course.lessons || []; // ensure array

  let lessonListHTML = "";

  if (lessons.length === 0) {
    lessonListHTML = "<p>No lessons added to this course yet.</p>";
  } else {
    lessons.forEach((lesson, index) => {
      lessonListHTML += `
        <li onclick="playLesson(${index})" id="lesson-${index}" 
            style="padding:10px;border-bottom:1px solid #ccc;cursor:pointer;">
          ${index + 1}. ${lesson.title}
        </li>
      `;
    });
  }

  courseDetailSection.innerHTML = `
    <h1 style="color:#2f80ed;">${course.title}</h1>
    <p>${course.description}</p>

    <div style="display:flex;gap:25px;margin-top:20px;">
      
      <!-- LEFT: VIDEO PLAYER -->
      <div style="width:70%;">
        <div id="videoPlayer">
          ${lessons.length > 0 
            ? getVideoEmbedHTML(lessons[0].videoUrl)
            : "<p>No lessons to show.</p>"}
        </div>
      </div>

      <!-- RIGHT: COURSE OUTLINE -->
      <div style="width:30%;background:#fff;padding:15px;border-radius:8px;
                  box-shadow:0 2px 10px rgba(0,0,0,0.1);height:450px;overflow-y:auto;">
        <h3 style="color:#2f80ed;">Course Outline</h3>
        <ul id="lessonsList" style="list-style:none;padding-left:0;">
          ${lessonListHTML}
        </ul>
      </div>

    </div>
  `;

  window._lessons = lessons;

  if (lessons.length > 0) {
    highlightLesson(0);
  }
}

// =============================
// Play selected lesson
// =============================
function playLesson(index) {
  const videoUrl = window._lessons[index].videoUrl;
  document.getElementById("videoPlayer").innerHTML = getVideoEmbedHTML(videoUrl);
  highlightLesson(index);
}

// =============================
// Highlight active lesson
// =============================
function highlightLesson(activeIndex) {
  const items = document.querySelectorAll("#lessonsList li");

  items.forEach((li, i) => {
    li.style.fontWeight = i === activeIndex ? "bold" : "normal";
    li.style.background = i === activeIndex ? "#d9ebff" : "transparent";
  });
}

// Load page
loadCourse();
