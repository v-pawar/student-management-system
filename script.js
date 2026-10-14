let allstudent = [];

const studentForm = document.getElementById("studentForm");

const studentTableBody = document.getElementById("studentTableBody");

function renderStudents() {
  studentTableBody.innerHTML = "";
  allstudent.forEach(function (student) {
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

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    // delete button logic here

    deleteButton.addEventListener("click", function () {
      allstudent = allstudent.filter(function (currentStudent) {
        return currentStudent.rollNumber !== student.rollNumber;
      });

      renderStudents();
    });
  });
}

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

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

  const cheak = allstudent.some(function (vivek) {
    return vivek.rollNumber === rollNumber;
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

  allstudent.push(student);

  console.log("All students:", allstudent);
  renderStudents();
  studentForm.reset();
});
