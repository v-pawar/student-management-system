let allstudent = [];

//  atentence record  here
let attendanceRecords = [];

function saveAttendance() {
  localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
}

// attendence  coming from localstorage

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

  console.log(student.firstName + " marked " + status);
}

function updateDashboard() {
  // Total students count
  const totalStudents = document.getElementById("totalStudents");
  totalStudents.innerText = allstudent.length;

  const presentToday = document.getElementById("presentToday");

  const today = new Date().toISOString().split("T")[0];

  const presentCount = attendanceRecords.filter(function (record) {
    return record.date === today && record.status === "Present";
  }).length;

  presentToday.innerText = presentCount;

  // absent count

  const absentToday = document.getElementById("absentToday");

  const absentCount = attendanceRecords.filter(function (record) {
    return record.date === today && record.status === "Absent";
  }).length;

  absentToday.innerText = absentCount;

  // Total unique courses count
  const totalCourses = document.getElementById("totalCourses");

  const courses = allstudent.map(function (student) {
    return student.course;
  });

  const uniqueCourses = new Set(courses);

  totalCourses.innerText = uniqueCourses.size;
}

// localstorage sanve  records
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(allstudent));
}

const savedStudents = localStorage.getItem("students");

if (savedStudents !== null) {
  allstudent = JSON.parse(savedStudents);
}

let isEditMode = false;

let editingRollNumber = null;

const studentForm = document.getElementById("studentForm");

const studentTableBody = document.getElementById("studentTableBody");

//    attendnce logic    here

function renderStudents(studentsToRender = allstudent) {
  studentTableBody.innerHTML = "";
  studentsToRender.forEach(function (student) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerText = `${student.firstName} ${student.lastName}`;
    row.appendChild(nameCell);

    const courseCell = document.createElement("td");
    courseCell.innerText = student.course;
    row.appendChild(courseCell);

    const yearCell = document.createElement("td");
    yearCell.innerText = student.year;
    row.appendChild(yearCell);

    // const statusCell = document.createElement("td");
    // statusCell.innerText = "Active";
    // row.appendChild(statusCell);

    const statusCell = document.createElement("td");

    const today = new Date().toISOString().split("T")[0];

    const attendanceRecord = attendanceRecords.find(function (record) {
      return record.rollNumber === student.rollNumber && record.date === today;
    });

    // if (attendanceRecord) {
    //   statusCell.innerText = attendanceRecord.status;
    // } else {
    //   statusCell.innerText = "Not Marked";
    // }

    // row.appendChild(statusCell);

    if (attendanceRecord) {
      statusCell.innerText = attendanceRecord.status;

      if (attendanceRecord.status === "Present") {
        statusCell.style.color = "#16a34a";
        statusCell.style.fontWeight = "bold";
      } else if (attendanceRecord.status === "Absent") {
        statusCell.style.color = "#dc2626";
        statusCell.style.fontWeight = "bold";
      }
    } else {
      statusCell.innerText = "Not Marked";
      statusCell.style.color = "#6b7280";
    }

    row.appendChild(statusCell);

    studentTableBody.appendChild(row);

    // attendence  logic

    const attendanceCell = document.createElement("td");
    row.appendChild(attendanceCell);

    // Present button
    const presentButton = document.createElement("button");
    presentButton.innerText = "Present";
    presentButton.classList.add("present-btn");
    attendanceCell.appendChild(presentButton);

    // Absent button
    const absentButton = document.createElement("button");
    absentButton.innerText = "Absent";
    absentButton.classList.add("absent-btn");
    attendanceCell.appendChild(absentButton);

    // Present button logic
    presentButton.addEventListener("click", function () {
      markAttendance(student, "Present");
    });

    // Absent button logic
    absentButton.addEventListener("click", function () {
      markAttendance(student, "Absent");
    });

    // delet button crete

    const actionCell = document.createElement("td");

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-btn");

    actionCell.appendChild(deleteButton);

    // Edit button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-btn");

    actionCell.appendChild(editButton);

    // Action cell ko row mein add karo
    row.appendChild(actionCell);

    // Edit button logic
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
    });

    // Delete button logic
    deleteButton.addEventListener("click", function () {
      allstudent = allstudent.filter(function (currentStudent) {
        return currentStudent.rollNumber !== student.rollNumber;
      });
      saveStudents(); // Save updated data
      renderStudents();
      updateDashboard(); // update counter  dashbord
    });
  });
}

renderStudents();
// Dashboard ko initially update karo
updateDashboard();

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

renderStudents();
// form submit logic
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;
  const rollNumber = document.getElementById("rollNumber").value;

  // form validation part   ******

  if (firstName === "") {
    alert("First name is required");
    return;
  }

  if (lastName === "") {
    alert("Last name is required");
    return;
  }

  if (email === "") {
    alert("Email is required");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email");
    return;
  }

  if (phone === "") {
    alert("phone number is required ");
    return;
  }

  const phonePattern = /^[0-9]{10}$/;

  if (!phonePattern.test(phone)) {
    alert("Please Enter A Valid 10 digit phone number ");
    return;
  }

  if (age === "") {
    alert("Age is Required");
    return;
  }

  if (Number(age) < 1 || Number(age) > 100) {
    alert("Age Must Be Between 1 And 100 ");
    return;
  }

  if (!Number.isInteger(Number(age))) {
    alert("Age must be a whole number");
    return;
  }

  if (course === "") {
    alert("please Select A  Course");
    return;
  }

  if (year === "") {
    alert("Please Select A Year ");
    return;
  }

  if (rollNumber === "") {
    alert("Roll Number Is Required");
    return;
  }

  const cheak = allstudent.some(function (currentStudent) {
    // Same student ko uske existing roll number ke saath edit karne do
    if (isEditMode && currentStudent.rollNumber === editingRollNumber) {
      return false;
    }

    // Kisi doosre student ka roll number duplicate nahi hona chahiye
    return currentStudent.rollNumber === rollNumber;
  });

  if (cheak) {
    alert("This roll number already exists");
    return;
  }

  // validation end here
  const student = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    age: age,
    course: course,
    year: year,
    rollNumber: rollNumber,
  };

  // allstudent.push(student);

  if (isEditMode) {
    const studentIndex = allstudent.findIndex(function (currentStudent) {
      return currentStudent.rollNumber === editingRollNumber;
    });

    if (studentIndex !== -1) {
      allstudent[studentIndex] = student;
    }
  } else {
    allstudent.push(student);
  }

  console.log("All students:", allstudent);

  saveStudents(); // LocalStorage mein data save karo
  renderStudents(); // Table update karo
  updateDashboard(); // update dashboard
  studentForm.reset(); // Form clear karo

  isEditMode = false;
  editingRollNumber = null;
});

const searchStudent = document.getElementById("searchStudent");

searchStudent.addEventListener("input", function () {
  const searchText = searchStudent.value.trim().toLowerCase();

  if (searchText === "") {
    renderStudents();
    return;
  }

  const filteredStudents = allstudent.filter(function (student) {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    // const rollNumber = student.rollNumber.toLowerCase();
    const rollNumber = String(student.rollNumber).toLowerCase();

    return fullName.includes(searchText) || rollNumber.includes(searchText);
  });

  renderStudents(filteredStudents);
});

// this is a sorted  logic here

const sortStudents = document.getElementById("sortStudents");

sortStudents.addEventListener("change", function () {
  const sortValue = sortStudents.value;

  if (sortValue === "name-asc") {
    const sortedStudents = [...allstudent];

    sortedStudents.sort(function (a, b) {
      return a.firstName.localeCompare(b.firstName);
    });

    renderStudents(sortedStudents);
  } else if (sortValue === "name-desc") {
    const sortedStudents = [...allstudent];

    sortedStudents.sort(function (a, b) {
      return b.firstName.localeCompare(a.firstName);
    });

    renderStudents(sortedStudents);
  } else if (sortValue === "roll-asc") {
    const sortedStudents = [...allstudent];

    sortedStudents.sort(function (a, b) {
      return Number(a.rollNumber) - Number(b.rollNumber);
    });

    renderStudents(sortedStudents);
  } else if (sortValue === "roll-desc") {
    const sortedStudents = [...allstudent];

    sortedStudents.sort(function (a, b) {
      return Number(b.rollNumber) - Number(a.rollNumber);
    });

    renderStudents(sortedStudents);
  }
});
