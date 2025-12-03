# Task & Team Management System - Final Project
**Course**: Web Development - Fall 2025/2026  
**Instructor**: Dr. Mohamed - Eng. Hamdy - Eng. Hossam  
**Student**: [علي سعيد &احمد سعد&عبد الرحمن هشام]  
**Project**: #3 - Reports and Statistics (Task Management System)

---

### 1. Problem Statement
Teams struggle to track tasks and projects effectively. There's no clear visibility on who is working on what, leading to missed deadlines and poor collaboration. Communication about task progress is scattered across different platforms (emails, WhatsApp, etc.).

### 2. Objectives
- Create and assign tasks to team members
- Track task status (To-Do → In Progress → Done)
- Implement comment system for task discussions
- Attach files to tasks
- Display productivity dashboard with statistics
- Send notifications for overdue tasks and new assignments
- Generate team performance reports

### 3. Key Features (تم تنفيذهم جميعًا)
- User authentication (Team Members, Managers)
- Project creation and management
- Task assignment with priorities and due dates
- Status tracking and updates
- Comments and file attachments
- Real-time notifications (in-app bell)
- Dashboard with charts and statistics (Chart.js)
- Generate team performance reports
- Bonus Features: Chat, Shared Documents, Timeline (غير مطلوبة لكن تمت إضافتها لتحسين التجربة)

### 4. Analysis & Design

#### ERD (Entity Relationship Diagram)
User 1 ---- N Project (manager)
User N ---- M Project (members)
Project 1 ---- N Task
Task 1 ---- 1 User (assignedTo)
Task N ---- 1 Comment (user → text)
Task N ---- M Attachment (files)

#### Database Schema (MongoDB - Mongoose)
- **User**: name, email, password, role (member/manager), projects[]
- **Project**: title, description, manager, members[], tasks[]
- **Task**: title, description, project, assignedTo, priority, status, dueDate, comments[], attachments[]
- **Message** (bonus): sender, content, room/timestamp
- **Document** (bonus): title, fileUrl, uploadedBy

#### Use Case Diagram
- Actor: Manager → Create Project, Assign Task, View Reports
- Actor: Member → View Tasks, Update Status, Add Comment, Upload File
- System → Send Notifications, Generate Charts

### 5. Technologies Used
- Frontend: HTML, CSS, JavaScript, Chart.js
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT + bcrypt
- File Upload: Multer
- Real-time: (Bonus) Socket.io for chat

### 6. Testing - Test Cases
| Feature              | Test Case                          | Expected Result       | Status   |
|----------------------|------------------------------------|-----------------------|----------|
| Login                | Valid credentials                  | Redirect to dashboard | Passed   |
| Login                | Wrong password                     | Show error            | Passed   |
| Create Project       | Manager only                       | Project created       | Passed   |
| Assign Task          | Manager assigns to member          | Task appears          | Passed   |
| Change Task Status   | Member changes status              | Updates instantly     | Passed   |
| Add Comment          | Any user on task                   | Comment appears       | Passed   |
| Upload File          | Attach file to task                | File uploaded         | Passed   |
| Dashboard Charts     | Load page                          | Charts render         | Passed   |
| Notifications        | New task assigned                  | Bell shows notification | Passed |

### 7. Folder Structure
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
├── public/ (Frontend)
├── uploads/
└── package.json

**Project is fully functional, responsive, and exceeds requirements**
