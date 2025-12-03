document.addEventListener('DOMContentLoaded', () => {
    
 const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
    console.log("Timeline Visualization Script Loaded.");
    

    const timelineContainer = document.getElementById('timeline-chart');
    
    function getProjectId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('projectId');
    }

    if (timelineContainer) {
        const projectId = getProjectId();
        if (!projectId) {
            timelineContainer.innerHTML = "<p>Error: Project ID not found. Please access this page from a project link.</p>";
            console.error("Project ID is missing from the URL.");
            return;
        }

        fetchProjectData(projectId)
            .then(data => {
                const formattedData = formatDataForTimeline(data);
                renderTimeline(formattedData, timelineContainer);
            })
            .catch(error => {
                console.error("Error loading timeline data:", error);
                timelineContainer.innerHTML = "<p>Failed to load timeline data. Please check the backend service.</p>";
            });
    }

    async function fetchProjectData(projectId) {
        try {
            const response = await fetch(`http://localhost:5000/api/timeline/project/${projectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Backend fetch failed:", error);
            return []; 
        }
    }

    function formatDataForTimeline(rawData) {
        console.log("Data formatting complete.");
        return rawData.map(task => ({
            id: task._id,
            name: task.title,
            end: task.dueDate.substring(0, 10),
            priority: task.priority,
            status: task.status
        }));
    }

    function renderTimeline(data, container) {
        container.innerHTML = "";

        if (data.length === 0) {
             container.innerHTML = "<p style='text-align:center;'>No tasks found for this project.</p>";
             return;
        }

        const timelineDiv = document.createElement('div');
        timelineDiv.classList.add('timeline');

        data.forEach((item, index) => {
            const itemClass = index % 2 === 0 ? 'right' : 'left';
            const priorityClass = `${item.priority}-priority`;
            const statusTag = item.status === 'completed' ? 'complete' : item.priority.charAt(0).toUpperCase() + item.priority.slice(1) + ' Priority';
            
            const taskElement = document.createElement('div');
            taskElement.classList.add('timeline-item', itemClass);
            taskElement.innerHTML = `
                <div class="timeline-content">
                    <div class="date">${new Date(item.end).toLocaleDateString()}</div>
                    <h2>${item.name}</h2>
                    <p>Priority: ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</p>
                    <span class="tag ${item.status === 'completed' ? 'complete' : priorityClass}">${statusTag}</span>
                </div>
            `;
            timelineDiv.appendChild(taskElement);
        });

        container.appendChild(timelineDiv);
        console.log("Timeline rendered successfully.");
    }
});