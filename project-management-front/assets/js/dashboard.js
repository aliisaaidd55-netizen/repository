document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // ================================
    // Protect Dashboard Page
    // ================================
    if (!token || !user) {
        window.location.href = "login.html";
        return;
    }

    // ================================
    // Display User Data
    // ================================
    document.getElementById("userName").textContent = user.fullName;
    document.getElementById("userEmail").textContent = user.email;

    // ================================
    // Populate sidebar avatar and name (centralized)
    // Reads the same `user` object from localStorage used elsewhere
    // ================================
    try {
        const sideName = document.getElementById('sideName');
        const sideAvatar = document.getElementById('sideAvatar');
        const name = (user.fullName || user.name || '').trim();
        if (name) {
            if (sideName) sideName.textContent = name;
            if (sideAvatar) {
                const initials = name.split(' ').map(n => n[0] || '').slice(0,2).join('').toUpperCase();
                sideAvatar.textContent = initials || 'U';
            }
        }
    } catch (e) { /* ignore */ }

    // ================================
    // Logout from Sidebar
    // ================================
    const logoutSide = document.getElementById("logoutSide");
    if (logoutSide) {
        logoutSide.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    // ================================
    // Logout from Header Button
    // ================================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    // ================================
    // Toggle dashboard visibility when clicking the title
    // ================================
    const logoTitle = document.querySelector('.logo');
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (logoTitle && dashboardContainer) {
        // make it clear it's interactive
        logoTitle.style.cursor = 'pointer';
        logoTitle.setAttribute('role', 'button');
        logoTitle.setAttribute('tabindex', '0');

        const STATE_KEY = 'dashboardCollapsed';

        const setCollapsed = (collapsed) => {
            dashboardContainer.classList.toggle('collapsed', collapsed);
            // aria-expanded indicates whether the region is visible
            logoTitle.setAttribute('aria-expanded', String(!collapsed));
            localStorage.setItem(STATE_KEY, collapsed ? '1' : '0');
        };

        // initialize from saved state
        try {
            const saved = localStorage.getItem(STATE_KEY);
            if (saved === '1') setCollapsed(true);
            else setCollapsed(false);
        } catch (e) {
            // ignore storage errors
        }

        const toggleDashboard = () => {
            const nowCollapsed = dashboardContainer.classList.toggle('collapsed');
            logoTitle.setAttribute('aria-expanded', String(!nowCollapsed));
            try { localStorage.setItem(STATE_KEY, nowCollapsed ? '1' : '0'); } catch (e) {}
        };

        logoTitle.addEventListener('click', toggleDashboard);
        // keyboard accessibility (Enter / Space)
        logoTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDashboard();
            }
        });
    }

    // ================================
    // Theme toggle (dark / light) - persists in localStorage
    // ================================
    const themeToggle = document.getElementById('themeToggle');
    const THEME_KEY = 'siteTheme';

    const applyTheme = (t) => {
        document.body.classList.remove('light','dark');
        document.body.classList.add(t === 'light' ? 'light' : 'dark');
        if (themeToggle) {
            themeToggle.textContent = (t === 'light') ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
            themeToggle.setAttribute('title', t === 'light' ? 'Switch to dark' : 'Switch to light');
        }
    };

    // determine initial theme: saved -> prefers-color-scheme -> default dark
    try {
        let saved = localStorage.getItem(THEME_KEY);
        if (!saved) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            saved = prefersDark ? 'dark' : 'light';
        }
        applyTheme(saved);
    } catch (e) {
        applyTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark');
            const next = isDark ? 'light' : 'dark';
            try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
            applyTheme(next);
        });
    }

});

// Helper (لو لسه مستخدمها في أجزاء تانية)
function removeErrors() {
    document.querySelectorAll(".input-error").forEach(e => e.remove());
}
function startLoading(button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Loading...";
}