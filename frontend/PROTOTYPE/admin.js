function showPage(id) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  const pg = document.getElementById(id);
  pg.style.display = 'flex';
  pg.classList.add('active');
  window.scrollTo(0, 0);
}

function goDashboard() {
  showPage('page-admin');
  showSection('dashboard', document.querySelector('#page-admin .nav-item'));
}

function showSection(name, navEl) {
  document.querySelectorAll('[id^="section-"]').forEach(s => s.style.display = 'none');
  document.getElementById('section-' + name).style.display = 'block';
  if (navEl) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
  }
}

function setFilter(type, btn) {
  btn.closest('.filter-bar').querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function openModal(name='', price='', cat='Burgers') {
  document.getElementById('modalTitle').textContent = name ? 'Edit Menu Item' : 'Add Menu Item';
  document.getElementById('itemName').value = name;
  document.getElementById('itemPrice').value = price;
  document.getElementById('itemCategory').value = cat;
  document.getElementById('itemModal').classList.add('show');
}

function closeModal() { document.getElementById('itemModal').classList.remove('show'); }

function saveItem() {
  closeModal();
  showToast('Menu item saved successfully!', 'green');
}

function openOrderModal() { document.getElementById('orderModal').classList.add('show'); }
function closeOrderModal() { document.getElementById('orderModal').classList.remove('show'); }

function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type === 'green' ? ' green-toast' : '');
  setTimeout(() => t.className = 'toast', 2800);
}