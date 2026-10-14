const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstNameInput = document.getElementById("firstName");

  const firstName = firstNameInput.value;

  console.log(firstName);
});

const fruits = ["Apple", "Banana", "Mango", "Orange"];

const result = fruits.filter(function (fruit) {
  return fruit !== "Mango";
});

console.log(result);
console.log(fruits);
