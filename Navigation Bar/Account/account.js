document.addEventListener('DOMContentLoaded', () => {
 const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
    const fullNameDisplay = document.getElementById('display-full-name');
    const usernameDisplay = document.getElementById('display-username');
    const teamDisplay = document.getElementById('display-team');
    const projectDisplay = document.getElementById('display-project');
    const lastLoginDisplay = document.getElementById('display-last-login');
    const profileAvatar = document.querySelector('.profile-avatar');
    
    const changeAccountBtn = document.getElementById('change-account-btn');
    const logoutBtn = document.getElementById('logout-btn');

    function loadUserData() {
        // نقرأ بيانات المستخدم من localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        // لو مش عامل لوجين → رجّعه للصفحة
        if (!user) {
            window.location.href = "../../LOGIN/login.html";
            return;
        }

        const initials = user.fullName
            ? user.fullName.split(' ').map(n => n[0]).join('')
            : "?";

        fullNameDisplay.textContent = user.fullName || "Unknown";
        usernameDisplay.textContent = `@${user.username || "unknown"}`;
        teamDisplay.textContent = user.team || "N/A";
        projectDisplay.textContent = user.project || "N/A";
        lastLoginDisplay.textContent = user.lastLogin || "N/A";
        profileAvatar.textContent = initials.toUpperCase();
    }

    // زر تغيير الحساب
    changeAccountBtn.addEventListener('click', () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "../../LOGIN/login.html"; 
    });

    // زر اللوج اوت
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "../../LOGIN/login.html";
    });

    loadUserData();
});
