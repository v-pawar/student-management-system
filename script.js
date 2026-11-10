/* ============================================================
   Student Management System — script.js
   ============================================================ */

/* ============================================================
   STATE
   ============================================================ */
let allstudent = [];
let attendanceRecords = [];
let isEditMode = false;
let editingRollNumber = null;

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchStudent = document.getElementById("searchStudent");
const sortStudents = document.getElementById("sortStudents");
const phoneInput = document.getElementById("phone");

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ------------------------------------------------------------
   Usage: showToast("Message", "success" | "error" | "info")
   Replaces alert() for a premium, non-blocking experience.
   ============================================================ */
const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ============================================================
   DELETE CONFIRMATION MODAL
   ------------------------------------------------------------
   Replaces confirm() with a custom modal.
   Usage:
    
   ============================================================ */
const deleteModal = document.getElementById("deleteModal");
const deleteModalText = document.getElementById("deleteModalText");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

let pendingDeleteCallback = null;

function askDelete(studentName, onConfirm) {
  deleteModalText.textContent = `Are you sure you want to delete "${studentName}"? This action cannot be undone.`;
  pendingDeleteCallback = onConfirm;
  deleteModal.classList.add("show");
}

function closeDeleteModal() {
  deleteModal.classList.remove("show");
  pendingDeleteCallback = null;
}

cancelDeleteBtn.addEventListener("click", closeDeleteModal);

confirmDeleteBtn.addEventListener("click", function () {
  if (typeof pendingDeleteCallback === "function") {
    pendingDeleteCallback();
  }
  closeDeleteModal();
});

// Close on overlay click
deleteModal.addEventListener("click", function (e) {
  if (e.target === deleteModal) closeDeleteModal();
});

// Close on ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeDeleteModal();
});

/* ============================================================
   ATTENDANCE — Save / Load / Mark
   ============================================================ */
function saveAttendance() {
  localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
}

function loadAttendance() {
  const savedAttendance = localStorage.getItem("attendanceRecords");
  if (savedAttendance !== null) {
    attendanceRecords = JSON.parse(savedAttendance);
  }
}

loadAttendance();

function markAttendance(student, status) {
  const today = new Date().toISOString().split("T")[0];

  const existingRecord = attendanceRecords.find(function (record) {
    return record.rollNumber === student.rollNumber && record.date === today;
  });

  if (existingRecord) {
    existingRecord.status = status;
  } else {
    attendanceRecords.push({
      rollNumber: student.rollNumber,
      date: today,
      status: status,
    });
  }

  saveAttendance();
  renderStudents();
  updateDashboard();

  // ===== Toast feedback instead of console.log =====
  showToast(
    `${student.firstName} marked ${status}`,
    status === "Present" ? "success" : "info",
  );
}

/* ============================================================
   DASHBOARD COUNTERS
   ============================================================ */
function updateDashboard() {
  document.getElementById("totalStudents").innerText = allstudent.length;

  const today = new Date().toISOString().split("T")[0];

  const presentCount = attendanceRecords.filter(function (record) {
    return record.date === today && record.status === "Present";
  }).length;

  document.getElementById("presentToday").innerText = presentCount;

  const absentCount = attendanceRecords.filter(function (record) {
    return record.date === today && record.status === "Absent";
  }).length;

  document.getElementById("absentToday").innerText = absentCount;

  const courses = allstudent.map(function (student) {
    return student.course;
  });
  const uniqueCourses = new Set(courses);
  document.getElementById("totalCourses").innerText = uniqueCourses.size;
}

/* ============================================================
   STUDENT PERSISTENCE
   ============================================================ */
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(allstudent));
}

const savedStudents = localStorage.getItem("students");
if (savedStudents !== null) {
  allstudent = JSON.parse(savedStudents);
}

/* ============================================================
   EMPTY STATE TOGGLE
   ============================================================ */
function toggleEmptyState(isEmpty) {
  const emptyState = document.getElementById("emptyState");
  emptyState.style.display = isEmpty ? "flex" : "none";
}

/* ============================================================
   RENDER TABLE
   ============================================================ */
function renderStudents(studentsToRender = allstudent) {
  studentTableBody.innerHTML = "";

  // Show empty state if no students to render
  if (studentsToRender.length === 0) {
    toggleEmptyState(true);
  } else {
    toggleEmptyState(false);
  }

  studentsToRender.forEach(function (student) {
    const row = document.createElement("tr");

    // Name
    const nameCell = document.createElement("td");
    nameCell.innerText = `${student.firstName} ${student.lastName}`;
    row.appendChild(nameCell);

    // Course
    const courseCell = document.createElement("td");
    courseCell.innerText = student.course;
    row.appendChild(courseCell);

    // Year
    const yearCell = document.createElement("td");
    yearCell.innerText = student.year;
    row.appendChild(yearCell);

    // Status badge
    const statusCell = document.createElement("td");
    const today = new Date().toISOString().split("T")[0];

    const attendanceRecord = attendanceRecords.find(function (record) {
      return record.rollNumber === student.rollNumber && record.date === today;
    });

    const statusBadge = document.createElement("span");

    if (attendanceRecord) {
      statusBadge.innerText = attendanceRecord.status;
      statusBadge.classList.add(
        attendanceRecord.status === "Present"
          ? "status-present"
          : "status-absent",
      );
    } else {
      statusBadge.innerText = "Not Marked";
      statusBadge.classList.add("status-not-marked");
    }

    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);

    // Attendance buttons
    const attendanceCell = document.createElement("td");

    const presentButton = document.createElement("button");
    presentButton.type = "button";
    presentButton.innerText = "Present";
    presentButton.classList.add("present-btn");
    attendanceCell.appendChild(presentButton);

    const absentButton = document.createElement("button");
    absentButton.type = "button";
    absentButton.innerText = "Absent";
    absentButton.classList.add("absent-btn");
    attendanceCell.appendChild(absentButton);

    presentButton.addEventListener("click", function () {
      markAttendance(student, "Present");
    });

    absentButton.addEventListener("click", function () {
      markAttendance(student, "Absent");
    });

    row.appendChild(attendanceCell);

    // Action buttons
    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-btn");
    actionCell.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.innerText = "Edit";
    editButton.classList.add("edit-btn");
    actionCell.appendChild(editButton);

    row.appendChild(actionCell);

    /* ===== EDIT logic ===== */
    editButton.addEventListener("click", function () {
      isEditMode = true;
      editingRollNumber = student.rollNumber;

      document.getElementById("firstName").value = student.firstName;
      document.getElementById("lastName").value = student.lastName;
      document.getElementById("email").value = student.email;
      document.getElementById("phone").value = student.phone;
      document.getElementById("age").value = student.age;
      document.getElementById("course").value = student.course;
      document.getElementById("rollNumber").value = student.rollNumber;
      document.getElementById("year").value = student.year;

      // ===== Update UI to show edit mode =====
      document.getElementById("formTitle").innerText = "Edit Student";
      document.getElementById("submitBtn").innerText = "Update Student";
      document.getElementById("cancelEditBtn").style.display = "inline-block";

      // Scroll form into view
      document.querySelector(".student-management").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      showToast("Edit mode — update the form", "info");
    });

    /* ===== DELETE logic — with confirmation modal ===== */
    deleteButton.addEventListener("click", function () {
      askDelete(`${student.firstName} ${student.lastName}`, function () {
        allstudent = allstudent.filter(function (currentStudent) {
          return currentStudent.rollNumber !== student.rollNumber;
        });
        saveStudents();
        renderStudents();
        updateDashboard();
        showToast("Student deleted successfully", "success");
      });
    });
    // ADD THIS LINE HERE
    studentTableBody.appendChild(row);
  });
}

renderStudents();
updateDashboard();

/* ============================================================
   PHONE INPUT — digits only, max 10
   ============================================================ */
phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

/* ============================================================
   CANCEL EDIT BUTTON
   ============================================================ */
document.getElementById("cancelEditBtn").addEventListener("click", function () {
  resetFormToAddMode();
  showToast("Edit cancelled", "info");
});

function resetFormToAddMode() {
  studentForm.reset();
  isEditMode = false;
  editingRollNumber = null;
  document.getElementById("formTitle").innerText = "Add New Student";
  document.getElementById("submitBtn").innerText = "Add Student";
  document.getElementById("cancelEditBtn").style.display = "none";

  // Clear any invalid states
  studentForm.querySelectorAll(".invalid").forEach(function (el) {
    el.classList.remove("invalid");
  });
}

/* ============================================================
   FORM SUBMIT — validation + add/edit
   ============================================================ */
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Clear previous invalid highlights
  studentForm.querySelectorAll(".invalid").forEach(function (el) {
    el.classList.remove("invalid");
  });

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;
  const rollNumber = document.getElementById("rollNumber").value.trim();

  // ===== VALIDATION with toast + input highlight =====
  function fail(message, inputId) {
    showToast(message, "error");
    if (inputId) {
      const el = document.getElementById(inputId);
      if (el) el.classList.add("invalid");
      if (el) el.focus();
    }
  }

  if (firstName === "") return fail("First name is required", "firstName");
  if (lastName === "") return fail("Last name is required", "lastName");
  if (email === "") return fail("Email is required", "email");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email))
    return fail("Please enter a valid email", "email");

  if (phone === "") return fail("Phone number is required", "phone");

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone))
    return fail("Enter a valid 10-digit phone number", "phone");

  if (age === "") return fail("Age is required", "age");
  if (Number(age) < 1 || Number(age) > 100)
    return fail("Age must be between 1 and 100", "age");
  if (!Number.isInteger(Number(age)))
    return fail("Age must be a whole number", "age");

  if (course === "") return fail("Please select a course", "course");
  if (year === "") return fail("Please select a year", "year");
  if (rollNumber === "") return fail("Roll number is required", "rollNumber");

  // ===== Duplicate roll number check =====
  const isDuplicate = allstudent.some(function (currentStudent) {
    if (isEditMode && currentStudent.rollNumber === editingRollNumber)
      return false;
    return currentStudent.rollNumber === rollNumber;
  });

  if (isDuplicate) return fail("This roll number already exists", "rollNumber");

  // ===== Build student object =====
  const student = {
    firstName,
    lastName,
    email,
    phone,
    age,
    course,
    year,
    rollNumber,
  };

  // ===== Add or update =====
  if (isEditMode) {
    const studentIndex = allstudent.findIndex(function (currentStudent) {
      return currentStudent.rollNumber === editingRollNumber;
    });

    if (studentIndex !== -1) {
      allstudent[studentIndex] = student;
    }
    showToast("Student updated successfully", "success");
  } else {
    allstudent.push(student);
    showToast("Student added successfully", "success");
  }

  saveStudents();
  renderStudents();
  updateDashboard();

  resetFormToAddMode();
});

/* ============================================================
   SEARCH
   ============================================================ */
searchStudent.addEventListener("input", function () {
  const searchText = searchStudent.value.trim().toLowerCase();

  if (searchText === "") {
    renderStudents();
    return;
  }

  const filteredStudents = allstudent.filter(function (student) {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const rollNumber = String(student.rollNumber).toLowerCase();
    return fullName.includes(searchText) || rollNumber.includes(searchText);
  });

  renderStudents(filteredStudents);
});

/* ============================================================
   SORT
   ============================================================ */
sortStudents.addEventListener("change", function () {
  const sortValue = sortStudents.value;

  if (sortValue === "name-asc") {
    const sorted = [...allstudent].sort(function (a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
    renderStudents(sorted);
  } else if (sortValue === "name-desc") {
    const sorted = [...allstudent].sort(function (a, b) {
      return b.firstName.localeCompare(a.firstName);
    });
    renderStudents(sorted);
  } else if (sortValue === "roll-asc") {
    const sorted = [...allstudent].sort(function (a, b) {
      return Number(a.rollNumber) - Number(b.rollNumber);
    });
    renderStudents(sorted);
  } else if (sortValue === "roll-desc") {
    const sorted = [...allstudent].sort(function (a, b) {
      return Number(b.rollNumber) - Number(a.rollNumber);
    });
    renderStudents(sorted);
  } else {
    renderStudents();
  }
});
