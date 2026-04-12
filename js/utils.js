const API = 'https://eye-health-backend-hcfu.onrender.com/api';

// ── Token helpers ──────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem('ec_token'),
  getUser:  () => JSON.parse(localStorage.getItem('ec_user') || 'null'),
  set: (token, user) => {
    localStorage.setItem('ec_token', token);
    localStorage.setItem('ec_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('ec_token');
    localStorage.removeItem('ec_user');
  },
  isLoggedIn: () => !!localStorage.getItem('ec_token'),
  redirect: () => {
    if (!localStorage.getItem('ec_token')) window.location.href = 'login.html';
  },
  redirectIfLoggedIn: () => {
    if (localStorage.getItem('ec_token')) window.location.href = 'dashboard.html';
  }
};

// ── API helper ─────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API}${endpoint}`, { headers, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ── Toast notifications ────────────────────────
function toast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-size:1rem">${icons[type]||'·'}</span><span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ── Form helpers ───────────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.disabled = false;
  }
}

function showError(selector, message) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-error">${message}</div>`;
}

function clearError(selector) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = '';
}

// ── Grade helpers ──────────────────────────────
const gradeConfig = {
  Excellent: { color: '#4cdb8a', icon: '👁️', bar: 100 },
  Good:      { color: '#00d4aa', icon: '✅', bar: 82 },
  Fair:      { color: '#ffb347', icon: '⚠️', bar: 67 },
  Poor:      { color: '#ff8c5a', icon: '🔶', bar: 50 },
  Critical:  { color: '#ff5a5a', icon: '🚨', bar: 25 },
};

function gradeStyle(grade) {
  return gradeConfig[grade] || gradeConfig['Fair'];
}

// ── Date formatter ─────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}