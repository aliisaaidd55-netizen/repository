document.addEventListener('DOMContentLoaded', () => {
    const membersList = document.getElementById("team-members-list");
    const chatLink = document.querySelector('.feature-card a[href="team-chat.html"]');
    const docsLink = document.querySelector('.feature-card a[href="shared-documents.html"]');
      const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');
    
    if (!projectId) {
        alert("Error: Project ID not found in URL. Cannot load collaboration features.");
        return;
    }

    if (chatLink) {
        chatLink.href = `team-chat.html?projectId=${projectId}`;
    }
    if (docsLink) {
        docsLink.href = `shared-documents.html?projectId=${projectId}`;
    }

    async function loadMembers() {
        try {
            const projectRes = await fetch(`http://localhost:5000/api/project/${projectId}`);
            if (!projectRes.ok) throw new Error("Project not found.");
            const projectData = await projectRes.json();
            const teamId = projectData.teamId; 

            const membersRes = await fetch(`http://localhost:5000/api/team/members/${teamId}`);
            const data = await membersRes.json();
            
            membersList.innerHTML = data.map(m => 
                `<li class="member-item"><img src="${m.avatarUrl || '../../imgs/default-avatar.png'}" alt=""><div><h4>${m.name}</h4><p>${m.role || ''}</p></div></li>`
            ).join("");

        } catch (e) { 
            membersList.innerHTML = `<li>Error loading team members: ${e.message}</li>`;
        }
    }
    
    loadMembers(); 
});