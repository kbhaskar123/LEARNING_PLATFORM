// Registration handler (handles role, stores feedback)
const regForm = document.getElementById('registerForm');
if(regForm){
  const regError = document.getElementById('registerError');
  const regSuccess = document.getElementById('registerSuccess');
  regForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    regError.textContent = '';
    regSuccess.textContent = '';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role') ? document.getElementById('role').value : 'student';

    // Password validation
    if(password.length < 8){
      regError.textContent = 'Password must be at least 8 characters!';
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if(res.ok){
        regSuccess.textContent = 'Registration successful! Please login.';
        setTimeout(()=>window.location.href='login.html',1200);
      }
      else{
        regError.textContent = data.msg || 'Registration failed';
      }
    } catch (err) {
      regError.textContent = 'Network or server error.';
    }
  });
}

// Login handler (saves token, role, user name)
const logForm = document.getElementById('loginForm');
if(logForm){
  const logError = document.getElementById('loginError');
  logForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    logError.textContent = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(res.ok){


    // Save full user object (REQUIRED for navbar)
    localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || "https://i.ibb.co/vJvbJrV/default-avatar.png"
    }));

    // Optional: keep these if backend uses them
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('name', data.user.name);

    window.location.href = 'dashboard.html';
}

    } catch (err) {
      logError.textContent = 'Network or server error.';
    }
  });
}
