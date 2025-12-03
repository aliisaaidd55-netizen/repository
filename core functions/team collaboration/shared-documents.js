const fileInput = document.getElementById("file-upload");
const filesList = document.getElementById("shared-files-list");
  const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('projectId');
}
async function uploadFiles(files){
  const projectId = getProjectId();
  if (!projectId) return alert("Error: Project ID not found in URL.");
  for(const f of files){
    const fd = new FormData();
    fd.append("file", f);
    fd.append("uploadedBy", localStorage.getItem("userName")||"Anonymous");
    fd.append("projectId", projectId);
    await fetch("http://localhost:5000/api/docs/upload", { method:"POST", body:fd });
  }
  loadFiles();
}
fileInput.addEventListener("change", e=> uploadFiles(e.target.files));
async function loadFiles(){
  const projectId = getProjectId();
  if (!projectId) return;
  try{
    const res = await fetch(`http://localhost:5000/api/docs/project/${projectId}`);
    const data = await res.json();
    filesList.innerHTML = data.map(d=>`<li class="file-item"><div class="file-name"><a href="${d.fileUrl}" target="_blank">${d.fileName}</a></div><div class="file-size">${(d.size/1024).toFixed(1)} KB</div><div class="file-uploader">${d.uploadedBy}</div><div class="file-action"><button data-id="${d._id}" class="delete-file">Delete</button></div></li>`).join("");
    document.querySelectorAll(".delete-file").forEach(btn=>btn.addEventListener("click", async e=>{
      const id = e.target.getAttribute("data-id");
      await fetch(`http://localhost:5000/api/docs/delete/${id}`, { method:"DELETE" });
      loadFiles();
    }));
  }catch(e){ filesList.innerHTML = `<li>Error loading files.</li>` }
}
loadFiles();