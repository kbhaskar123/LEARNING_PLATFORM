const announcementsList = document.getElementById('announcementsList');

async function fetchAnnouncements() {
  try {
    const response = await fetch('http://localhost:5000/api/announcements');
    const data = await response.json();
    displayAnnouncements(data);
  } catch (err) {
    announcementsList.innerHTML = '<li>Failed to load announcements</li>';
  }
}

function displayAnnouncements(announcements) {
  announcementsList.innerHTML = '';
  if (!announcements.length) {
    announcementsList.innerHTML = '<li>No announcements available.</li>';
    return;
  }
  announcements.forEach((a) => {
    const li = document.createElement('li');
    li.innerHTML = `<h3>${a.title}</h3><p>${a.description}</p><small>${new Date(a.date).toLocaleDateString()}</small>`;
    announcementsList.appendChild(li);
  });
}

fetchAnnouncements();
