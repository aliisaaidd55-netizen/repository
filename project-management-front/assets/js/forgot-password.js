document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgot-password-form");
    const messageArea = document.getElementById("message-area");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        // التحقق من الإيميل
        if (!email) {
            showMessage("Please enter your email", "error");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json().catch(() => ({
                message: "Invalid JSON from server"
            }));

            if (res.ok) {
                form.style.display = "none";
                showMessage(data.message, "success");
            } else {
                showMessage(data.message || "Server error occurred", "error");
            }

        } catch (error) {
            showMessage("Cannot connect to server — check backend", "error");
            console.error("Fetch error:", error);
        }
    });

    function showMessage(msg, type) {
        messageArea.style.display = "block";
        messageArea.classList.remove("success-message", "error-message");

        if (type === "success") {
            messageArea.classList.add("success-message");
        } else {
            messageArea.classList.add("error-message");
        }

        messageArea.innerHTML = msg;
    }
});
