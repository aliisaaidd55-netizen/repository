const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messagesDisplay = document.getElementById("messages-display");
  const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('projectId');
}
async function sendMessage(){
  const projectId = getProjectId();
  const txt = messageInput.value.trim();
  if(!txt || !projectId) return;
  await fetch("http://localhost:5000/api/chat/send", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ 
        userName: localStorage.getItem("userName")||"Anonymous", 
        message: txt,
        projectId: projectId 
    })
  });
  messageInput.value = "";
  loadMessages();
}
async function loadMessages(){
  const projectId = getProjectId();
  if (!projectId) return;
  try{
    const res = await fetch(`http://localhost:5000/api/chat/project/${projectId}`);
    const data = await res.json();
    messagesDisplay.innerHTML = data.map(m=>`<div class="msg ${m.userName === (localStorage.getItem("userName")||"Anonymous") ? 'message-sent' : 'message-received'}"><strong>${m.userName}</strong><p>${m.message}</p><span>${new Date(m.timestamp).toLocaleString()}</span></div>`).join("");
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
  }catch(e){}
}
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e=>{ if(e.key==="Enter") sendMessage(); });
setInterval(loadMessages,2000);
loadMessages();