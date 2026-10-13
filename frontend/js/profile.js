document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': token }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    const user = await response.json();
    document.getElementById('name').textContent = user.name;
    document.getElementById('email').textContent = user.email;
    document.getElementById('role').textContent = user.role;
  } catch (err) {
    alert(err.message);
    window.location.href = 'login.html';
  }
}

fetchUserProfile();
