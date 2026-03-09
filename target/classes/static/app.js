/* ═══════════════════════════════════════════════════════════ */
/*  AuthPortal - Frontend JavaScript                          */
/*  Connects to Spring Boot Backend API                       */
/* ═══════════════════════════════════════════════════════════ */

const API_BASE = '/api/auth';

// ─── Particles ─────────────────────────────────────────────
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        const colors = ['#818cf8', '#c084fc', '#f472b6', '#34d399', '#60a5fa'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);
    }
})();

// ─── Tab Switching ─────────────────────────────────────────
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const indicator = document.getElementById('tabIndicator');
    const statusMsg = document.getElementById('statusMessage');

    statusMsg.className = 'status-message';

    if (tab === 'login') {
        loginForm.className = 'auth-form active';
        signupForm.className = 'auth-form';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        indicator.classList.remove('right');
    } else {
        loginForm.className = 'auth-form';
        signupForm.className = 'auth-form active';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        indicator.classList.add('right');
    }
}

// ─── Password Toggle ──────────────────────────────────────
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
           </svg>`;
}

// ─── Password Strength ────────────────────────────────────
const signupPassword = document.getElementById('signupPassword');
if (signupPassword) {
    signupPassword.addEventListener('input', function () {
        const val = this.value;
        const container = document.getElementById('passwordStrength');
        const bars = container.querySelectorAll('.strength-bar');
        const text = document.getElementById('strengthText');

        if (val.length === 0) {
            container.classList.remove('visible');
            return;
        }
        container.classList.add('visible');

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong'];
        const classes = ['active', 'medium', 'strong', 'strong'];

        bars.forEach((bar, i) => {
            bar.className = 'strength-bar';
            if (i < score) bar.classList.add(classes[score - 1]);
        });
        text.textContent = labels[Math.max(0, score - 1)] || 'Too short';
    });
}

// ─── Status Messages ──────────────────────────────────────
function showStatus(type, message) {
    const el = document.getElementById('statusMessage');
    el.className = `status-message show ${type}`;
    el.querySelector('.status-text').textContent = message;
    setTimeout(() => {
        el.className = 'status-message';
    }, 5000);
}

// ─── Login Handler ────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showStatus('error', 'Please fill in all fields');
        return;
    }

    btn.classList.add('loading');

    try {
        const res = await fetch(`${API_BASE}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }

        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('username', data.username || username);

        showStatus('success', 'Login successful! Redirecting...');

        setTimeout(() => {
            showDashboard(data.token, data.username || username);
        }, 800);

    } catch (err) {
        showStatus('error', err.message || 'Login failed. Check your credentials.');
    } finally {
        btn.classList.remove('loading');
    }
}

// ─── Signup Handler ───────────────────────────────────────
async function handleSignup(e) {
    e.preventDefault();
    const btn = document.getElementById('signupBtn');
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!username || !email || !password) {
        showStatus('error', 'Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showStatus('error', 'Password must be at least 6 characters');
        return;
    }

    btn.classList.add('loading');

    try {
        const res = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const text = await res.text();

        if (!res.ok) {
            // Backend returns error message as plain text (ResponseEntity.badRequest().body("Error: ..."))
            throw new Error(text || 'Registration failed');
        }

        showStatus('success', '🎉 ' + text);

        // Auto-switch to login tab
        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').focus();
        }, 1500);

    } catch (err) {
        showStatus('error', err.message || 'Signup failed. Please try again.');
    } finally {
        btn.classList.remove('loading');
    }
}

// ─── Dashboard ────────────────────────────────────────────
function showDashboard(token, username) {
    document.getElementById('authCard').style.display = 'none';
    const dashboard = document.getElementById('dashboardCard');
    dashboard.classList.remove('hidden');
    document.getElementById('welcomeUser').textContent = `Welcome, ${username}!`;
    document.getElementById('tokenValue').textContent = token;
}

function handleLogout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    document.getElementById('dashboardCard').classList.add('hidden');
    document.getElementById('authCard').style.display = '';
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    switchTab('login');
    showStatus('success', 'Logged out successfully');
}

function copyToken() {
    const token = document.getElementById('tokenValue').textContent;
    navigator.clipboard.writeText(token).then(() => {
        const btn = document.querySelector('.copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        btn.style.color = '#34d399';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.color = '';
        }, 2000);
    });
}

// ─── Check existing session ───────────────────────────────
(function checkSession() {
    const token = localStorage.getItem('jwt_token');
    const username = localStorage.getItem('username');
    if (token && username) {
        showDashboard(token, username);
    }
})();
