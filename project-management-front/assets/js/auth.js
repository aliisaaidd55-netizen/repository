document.addEventListener("DOMContentLoaded", () => {

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
    // LOGIN FORM LOGIC
    // =============================


    const loginForm = document.querySelector(".form-box.login form");

    if (loginForm) {
        const emailInput = loginForm.querySelector("input[type='email']");
        const passwordInput = loginForm.querySelector("input[type='password']");
        const togglePass = document.getElementById("togglePass");
        const submitBtn = loginForm.querySelector(".btn");

        // Toggle password
        if (togglePass) {
            togglePass.addEventListener("click", () => {
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    togglePass.innerHTML = '<ion-icon name="eye"></ion-icon>';
                } else {
                    passwordInput.type = "password";
                    togglePass.innerHTML = '<ion-icon name="eye-off"></ion-icon>';
                }
            });
        }

        // Submit login
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            removeErrors();
            let valid = true;

            if (!emailInput.value.trim()) {
                showError(emailInput, "Email is required");
                valid = false;
            }

            if (!passwordInput.value.trim()) {
                showError(passwordInput, "Password is required");
                valid = false;
            }

            if (!valid) return;

            startLoading(submitBtn);

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value
                    })
                });

                const data = await res.json();

                stopLoading(submitBtn);

                if (!res.ok) {
                    showGeneralError(data.message || "Login failed");
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                window.location.href = "../../../taskblitz.html";

            } catch (err) {
                stopLoading(submitBtn);
                showGeneralError("Server error, try again later");
            }
        });
    }

    // =============================
    // REGISTER FORM LOGIC
    // =============================

    const registerForm = document.querySelector(".form-box.register form");

    if (registerForm) {
        const fullNameInput = registerForm.querySelector("input[name='fullName']");
        const emailInput = registerForm.querySelector("input[name='email']");
        const passwordInput = registerForm.querySelector("input[name='password']");
        const submitBtn = registerForm.querySelector(".btn");

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            removeErrors();
            let valid = true;

            if (!fullNameInput.value.trim()) {
                showError(fullNameInput, "Full name is required");
                valid = false;
            }

            if (!emailInput.value.trim()) {
                showError(emailInput, "Email is required");
                valid = false;
            }

            if (!passwordInput.value.trim()) {
                showError(passwordInput, "Password is required");
                valid = false;
            }

            if (!valid) return;

            startLoading(submitBtn);

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: fullNameInput.value,
                        email: emailInput.value,
                        password: passwordInput.value
                    })
                });

                const data = await res.json();

                stopLoading(submitBtn);

                if (!res.ok) {
                    showGeneralError(data.message || "Registration failed");
                    return;
                }

                alert("Account created! You can now log in.");
                window.location.href = "login.html";

            } catch (err) {
                stopLoading(submitBtn);
                showGeneralError("Server error, try again later");
            }
        });
    }

    // =============================
    // Helper Functions
    // =============================

    function showError(input, message) {
        const parent = input.parentElement;
        let error = document.createElement("small");
        error.className = "input-error";
        error.style.color = "red";
        error.style.fontSize = "0.85em";
        error.style.position = "absolute";
        error.style.bottom = "-18px";
        error.textContent = message;
        parent.appendChild(error);
    }

    function removeErrors() {
        document.querySelectorAll(".input-error").forEach(e => e.remove());
    }

    function startLoading(btn) {
        btn.disabled = true;
        btn.classList.add("loading");
    }

    function stopLoading(btn) {
        btn.disabled = false;
        btn.classList.remove("loading");
    }

    function showGeneralError(msg) {
        let box = document.querySelector(".form-box.login") ||
                  document.querySelector(".form-box.register");

        let error = document.createElement("div");
        error.className = "general-error";
        error.style.color = "white";
        error.style.background = "rgba(200,0,0,0.7)";
        error.style.padding = "10px";
        error.style.margin = "10px 0";
        error.style.borderRadius = "6px";
        error.style.textAlign = "center";
        error.textContent = msg;

        document.querySelectorAll(".general-error").forEach(e => e.remove());
        box.prepend(error);

        setTimeout(() => error.remove(), 3000);
    }
});
