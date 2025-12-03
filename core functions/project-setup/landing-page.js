document.addEventListener('DOMContentLoaded', () => {
    const showJoinFormBtn = document.getElementById('show-join-form-btn');
    const joinTeamModal = document.getElementById('join-team-modal');
    const closeBtn = document.querySelector('.close-btn');
    const joinTeamForm = document.getElementById('join-team-form');
    const teamCodeInput = document.getElementById('team-code-input');
    const joinCodeError = document.getElementById('join-code-error');
      const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }

    showJoinFormBtn.addEventListener('click', () => {
        joinTeamModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        joinTeamModal.style.display = 'none';
        joinCodeError.textContent = ''; 
        teamCodeInput.value = ''; 
    });

    window.addEventListener('click', (event) => {
        if (event.target === joinTeamModal) {
            joinTeamModal.style.display = 'none';
            joinCodeError.textContent = '';
            teamCodeInput.value = '';
        }
    });

    joinTeamForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        joinCodeError.textContent = ''; 
        const teamCode = teamCodeInput.value.trim().toUpperCase();

        if (teamCode === "") {
            joinCodeError.textContent = 'Access Code cannot be empty.';
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/project/join", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamCode })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (window.showNotification) {
                    window.showNotification(`Successfully joined project!`, 'success');
                } else {
                    alert(`Successfully joined project!`);
                }
                setTimeout(() => {
                    window.location.href = `../team-collaboration/team-collaboration.html?projectId=${data.projectId}`;
                }, 500);
            } else {
                joinCodeError.textContent = data.error || 'Invalid team code or project not found.';
            }

        } catch (error) {
            console.error('Join Project Error:', error);
            joinCodeError.textContent = 'An error occurred while connecting to the server.';
        }
    });
});