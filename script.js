let allstudent = [];

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

    const statusCell = document.createElement("td");
    statusCell.innerText = "Active";
    row.appendChild(statusCell);

    studentTableBody.appendChild(row);

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
    });
  });
}

renderStudents();

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
