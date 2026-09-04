/* -----------------------------------------
   Student Attendance System - script.js 
   Clean, structured & fully compatible 
------------------------------------------*/

// DOM Elements
const nameInput = document.getElementById("studentName");
const dateInput = document.getElementById("attendanceDate");
const tableBody = document.querySelector("#attendance-tbody"); // updated ID
const markAllPresentBtn = document.getElementById("markAllPresent");
const clearAllBtn = document.getElementById("clearAll");
const exportCsvBtn = document.getElementById("exportCsv");
const downloadPdfBtn = document.getElementById("downloadPdf");

// Global
let students = [];
let rollNo = 1;

/* -----------------------------------------
   Initialization
------------------------------------------*/
window.onload = function () {
  loadSavedData();
  setTodayDate();
  setupEventListeners();
  displayStudents();
};

/* -----------------------------------------
   Load saved student data
------------------------------------------*/
function loadSavedData() {
  const savedData = localStorage.getItem("students");

  if (savedData) {
    students = JSON.parse(savedData);
    if (students.length > 0) {
      rollNo = students[students.length - 1].roll + 1;
    }
  }
}

/* -----------------------------------------
   Save to localStorage
------------------------------------------*/
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

/* -----------------------------------------
   Set today's date + on-change listener
------------------------------------------*/
function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  dateInput.addEventListener("change", displayStudents);
}

/* -----------------------------------------
   Event Listeners setup
------------------------------------------*/
function setupEventListeners() {
  document
    .getElementById("add-student-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addStudent();
    });

  if (markAllPresentBtn)
    markAllPresentBtn.addEventListener("click", markAllPresent);

  if (clearAllBtn)
    clearAllBtn.addEventListener("click", clearAllStudents);

  if (exportCsvBtn)
    exportCsvBtn.addEventListener("click", exportCSV);

  if (downloadPdfBtn)
    downloadPdfBtn.addEventListener("click", function () {
      alert("PDF export feature is coming soon!");
    });

  setupLogoutHandler();
}

/* -----------------------------------------
   Add student
------------------------------------------*/
function addStudent() {
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Student name is required");
    return;
  }

  const student = {
    roll: rollNo,
    name: name,
    attendance: {}
  };

  students.push(student);
  rollNo++;
  nameInput.value = "";

  saveData();
  displayStudents();
}

/* -----------------------------------------
   Display Students in Table
------------------------------------------*/
function displayStudents() {
  tableBody.innerHTML = "";
  const selectedDate = dateInput.value;

  students.forEach((student) => {
    const status = student.attendance[selectedDate] || "Not Marked";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.roll}</td>
      <td>${student.name}</td>
      <td>
        <span class="${status === 'Present' ? 'present' : status === 'Absent' ? 'absent' : ''}">
          ${status}
        </span>
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-success me-1" data-action="present" data-roll="${student.roll}">
          Present
        </button>
        <button class="btn btn-sm btn-danger" data-action="absent" data-roll="${student.roll}">
          Absent
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Attach event listeners after rows added
  attachStatusButtons();
  updateStats();
}

/* -----------------------------------------
   Mark Present / Absent
------------------------------------------*/
function attachStatusButtons() {
  const buttons = document.querySelectorAll("[data-action]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const roll = parseInt(btn.dataset.roll);
      const action = btn.dataset.action;

      markAttendance(roll, action === "present" ? "Present" : "Absent");
    });
  });
}

function markAttendance(roll, status) {
  const selectedDate = dateInput.value;
  const student = students.find((s) => s.roll === roll);

  if (student) {
    student.attendance[selectedDate] = status;
  }

  saveData();
  displayStudents();
}

/* -----------------------------------------
   Mark ALL present
------------------------------------------*/
function markAllPresent() {
  const selectedDate = dateInput.value;

  students.forEach((student) => {
    student.attendance[selectedDate] = "Present";
  });

  saveData();
  displayStudents();
}

/* -----------------------------------------
   Clear All Students
------------------------------------------*/
function clearAllStudents() {
  if (!confirm("Are you sure you want to delete all students?")) return;

  students = [];
  rollNo = 1;

  saveData();
  displayStudents();
}

/* -----------------------------------------
   Export CSV
------------------------------------------*/
function exportCSV() {
  let selectedDate = dateInput.value;
  let csv = "Roll No,Student Name,Status\n";

  students.forEach((student) => {
    let status = student.attendance[selectedDate] || "Not Marked";
    csv += `${student.roll},${student.name},${status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${selectedDate}.csv`;
  a.click();
}

/* -----------------------------------------
   Update Summary Stats
------------------------------------------*/
function updateStats() {
  const selectedDate = dateInput.value;

  let presentCount = 0;
  let absentCount = 0;

  students.forEach((student) => {
    const status = student.attendance[selectedDate];
    if (status === "Present") presentCount++;
    else if (status === "Absent") absentCount++;
  });

  document.getElementById("stat-total").textContent = students.length;
  document.getElementById("stat-present").textContent = presentCount;
  document.getElementById("stat-absent").textContent = absentCount;
}

/* -----------------------------------------
   Logout Handler
------------------------------------------*/
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    try {
      sessionStorage.removeItem("sas_logged_in");
      sessionStorage.removeItem("sas_user");
    } catch (e) {}

    window.location.href = "login.html";
  });
}
