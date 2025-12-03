document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
    const setupForm = document.getElementById('project-setup-form');
    const projectTitleInput = document.getElementById('project-title');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    const addTaskButton = document.getElementById('add-task-button');
    const tasksList = document.getElementById('tasks-list');
    
    const teamNameInput = document.getElementById('team-name');
    const teamCodeInput = document.getElementById('team-code');
    const teamCodeError = document.getElementById('team-code-error');
    
    teamCodeInput.addEventListener('input', checkTeamCodeAvailability);
    
    function attachRemoveListeners() {
        tasksList.querySelectorAll('.remove-task-btn').forEach(button => {
            button.onclick = function() {
                this.closest('.task-item').remove();
            };
        });
    }

    function createNewTaskItem() {
        const item = document.createElement('div');
        item.classList.add('task-item');
        item.innerHTML = `
            <input type="text" placeholder="Task Title (e.g., Define Wireframes)" required>
            <input type="date" title="Due Date" required>
            <select title="Priority">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <button type="button" class="remove-task-btn">✖</button>
        `;
        tasksList.appendChild(item);
        attachRemoveListeners();
    }

    addTaskButton.addEventListener('click', createNewTaskItem);
    attachRemoveListeners();

    function collectFormData() {
        const taskItems = tasksList.querySelectorAll('.task-item');
        const tasks = Array.from(taskItems).map(item => ({
            title: item.querySelector('input[type="text"]').value.trim(),
            dueDate: item.querySelector('input[type="date"]').value,
            priority: item.querySelector('select').value
        }));
        
        const newTeamName = teamNameInput.value.trim();
        const newTeamCode = teamCodeInput.value.trim().toUpperCase();
        
        return {
            title: projectTitleInput.value.trim(),
            description: document.getElementById('project-desc').value.trim(),
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            newTeam: {
                name: newTeamName,
                code: newTeamCode
            },
            tasks: tasks,
            leaderId: localStorage.getItem("userId") || null
        };
    }
    
    async function checkTeamCodeAvailability() {
        const teamCode = teamCodeInput.value.trim().toUpperCase();
        if (teamCode.length < 4) {
            teamCodeError.textContent = '';
            return false;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/team/check/${teamCode}`);
            const data = await res.json();

            if (data.exists) {
                teamCodeError.textContent = 'Team code is already taken.';
                return false;
            } else {
                teamCodeError.textContent = 'Team code is available.';
                teamCodeError.style.color = 'green';
                return true;
            }
        } catch (error) {
            teamCodeError.textContent = 'Error checking code availability.';
            return false;
        } finally {
             if (!teamCodeError.textContent.includes('available')) {
                teamCodeError.style.color = 'red';
            }
        }
    }

    async function submitProject() {
        teamCodeError.textContent = '';
        const isCodeAvailable = await checkTeamCodeAvailability();

        if (!isCodeAvailable) {
            alert('Please fix the errors in the form (especially the Team Code).');
            return;
        }

        const projectData = collectFormData();

        try {
            const response = await fetch("http://localhost:5000/api/project/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (window.showNotification) {
                    window.showNotification(`Project setup successfully: ${projectData.title}`, 'success');
                } else {
                     alert(`Project setup successfully: ${projectData.title}`);
                }
                
                setTimeout(() => {
                    window.location.href = `../team collaboration/team-collaboration.html?projectId=${data.projectId}`;
                }, 500);

            } else {
                teamCodeError.textContent = data.error || 'Project creation failed.';
                alert(teamCodeError.textContent);
            }

        } catch (error) {
            console.error('Create Project Error:', error);
            alert('An error occurred while connecting to the server.');
        }
    }

    if (setupForm) {
        setupForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            submitProject();
        });
    }
});