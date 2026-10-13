document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const token = localStorage.getItem('token');

document.getElementById('announcementForm').onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const res = await fetch('http://localhost:5000/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization':'Bearer '+token
    },
    body: JSON.stringify({title, description})
  });
  const data = await res.json();
  document.getElementById('announcementMsg').textContent = res.ok ? 'Announcement Added!' : (data.msg || 'Error');
  if(res.ok){ document.getElementById('announcementForm').reset(); loadAnnouncements(); }
};

async function loadAnnouncements(){
  const res = await fetch('http://localhost:5000/api/announcements');
  const announcements = await res.json();
  const list = document.getElementById('announcementsList');
  list.innerHTML = '';
  if(Array.isArray(announcements) && announcements.length){
    announcements.forEach(announcement => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${announcement.title}</strong>
        <button onclick="deleteAnnouncement('${announcement._id}')" class="button" style="background:#f7cac9;color:#333;float:right;">Delete</button>
        <div>${announcement.description}</div>
        <div>${new Date(announcement.date).toLocaleString()}</div>`;
      list.appendChild(li);
    });
  }else{
    list.innerHTML = '<li>No announcements found.</li>';
  }
}

async function deleteAnnouncement(id){
  if(!confirm('Delete this announcement?')) return;
  const res = await fetch('http://localhost:5000/api/announcements/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  loadAnnouncements();
}

window.onload = loadAnnouncements;
