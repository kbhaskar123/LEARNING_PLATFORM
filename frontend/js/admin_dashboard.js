// ===============================
// ADMIN DASHBOARD – SCRIPT FILE
// ===============================

// Check login & role validation
const role = localStorage.getItem("role");
if (role !== "admin") {
    alert("Access denied! Admins only.");
    window.location.href = "login.html";
}

// Display admin name
const adminName = localStorage.getItem("name");
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("adminContent");
    if (content && adminName) {
        content.innerHTML = `
            <h2>Welcome, ${adminName}</h2>
            <p>Select a section above to manage courses and quizzes.</p>
        `;
    }
});

// -------------------------------
// Navigation Buttons (PUBLIC Folder Compatible)
// -------------------------------
document.getElementById("manageCoursesBtn").addEventListener("click", () => {
    window.location.href = "manage_courses.html"; 
});

document.getElementById("manageQuizzesBtn").addEventListener("click", () => {
    window.location.href = "manage_quizzes.html"; 
});

// -------------------------------
// LOGOUT
// -------------------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "public/login.html";
});
