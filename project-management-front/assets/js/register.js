document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const toggle1 = document.getElementById("togglePass1");
    const toggle2 = document.getElementById("togglePass2");
    const submitBtn = document.querySelector(".btn");

    const API_URL = "http://localhost:5000/api/auth";

    // =============================
    // THEME TOGGLE
    // =============================

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

    // =============================
    // REGISTER FORM LOGIC
    // =============================


    function setupToggle(input, toggleElement) {
        toggleElement.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                toggleElement.innerHTML = '<ion-icon name="eye"></ion-icon>';
            } else {
                input.type = "password";
                toggleElement.innerHTML = '<ion-icon name="eye-off"></ion-icon>';
            }
        });
    }

    setupToggle(password, toggle1);
    setupToggle(confirmPassword, toggle2);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        removeErrors();

        let valid = true;

        if (fullName.value.trim().length < 3) {
            showError(fullName, "Name must be at least 3 characters");
            valid = false;
        }

        if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            showError(email, "Invalid email address");
            valid = false;
        }

        if (password.value.length < 6) {
            showError(password, "Password must be at least 6 characters");
            valid = false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, "Passwords do not match");
            valid = false;
        }

        if (!valid) return;

        startLoading();

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: fullName.value,
                    email: email.value,
                    password: password.value
                })
            });

            const data = await res.json();

            stopLoading();

            if (!res.ok) {
                showGeneralError(data.message || "Registration failed");
                return;
            }

            alert("Account created successfully!");
            window.location.href = "login.html";

        } catch (err) {
            stopLoading();
            showGeneralError("Server error, try again later");
        }

    });

    function showError(input, message) {
        let error = document.createElement("small");
        error.className = "input-error";
        error.style.color = "red";
        error.style.fontSize = "0.8em";
        error.style.position = "absolute";
        error.style.bottom = "-18px";
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    function removeErrors() {
        document.querySelectorAll(".input-error").forEach(e => e.remove());
    }

    function startLoading() {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
    }

    function stopLoading() {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
    }

    function showGeneralError(msg) {
        let box = document.querySelector(".form-box");

        let err = document.createElement("div");
        err.className = "general-error";
        err.style.color = "white";
        err.style.background = "rgba(200,0,0,0.7)";
        err.style.padding = "10px";
        err.style.margin = "10px 0";
        err.style.borderRadius = "6px";
        err.style.textAlign = "center";
        err.textContent = msg;

        document.querySelectorAll(".general-error").forEach(e => e.remove());
        box.prepend(err);

        setTimeout(() => err.remove(), 3000);
    }

});
