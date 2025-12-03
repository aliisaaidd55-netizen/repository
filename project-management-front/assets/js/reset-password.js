document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetForm");
    const msg = document.getElementById("msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const token = new URLSearchParams(window.location.search).get("token");

        // تأكد إن التوكن موجود
        if (!token) {
            showMessage("Invalid or missing token in URL", "error");
            return;
        }

        // تأكد إن الباسورد جديد مش فاضي
        if (!newPassword) {
            showMessage("Please enter a new password", "error");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword })
            });

            const data = await res.json().catch(() => ({
                message: "Invalid server response"
            }));

            if (res.ok) {
                showMessage(data.message, "success");
                form.reset();
            } else {
                showMessage(data.message || "Server error", "error");
            }

        } catch (error) {
            console.error("Fetch error:", error);
            showMessage("Cannot connect to server — check backend", "error");
        }
    });

    function showMessage(text, type) {
        msg.style.display = "block";
        msg.innerText = text;

        msg.classList.remove("error", "success");

        if (type === "success") {
            msg.classList.add("success");
        } else {
            msg.classList.add("error");
        }
    }
});
// ==============================