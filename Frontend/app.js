var main = document.getElementById("main");
var searched = document.getElementById("search");

// 👸 Yeh function hai jo  (server) se tamam students ka data mangta hai.
function fetchStudents() {
  fetch("http://localhost:5000/api/students/all")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && Array.isArray(data.students)) {
        console.log("Students data from backend:", data.students);
        updateTable(data.students);
      } else {
        console.error("Invalid data format received:", data);
      }
    })
    .catch((error) => console.error("Error fetching students:", error));
}



function updateTable(students) {
  main.innerHTML = "";
  students.forEach((student, index) => {
    main.innerHTML += `
      <tr id="row-${student.rollnumber}">
        <td>${index + 1}</td>
        <td>${student.name || "N/A"}</td>
        <td>${student.rollnumber || "N/A"}</td>
        <td>${parseFloat(student.math) || 0}</td>
        <td>${parseFloat(student.eng) || 0}</td>
        <td>${parseFloat(student.urd) || 0}</td>
        <td>${parseFloat(student.sci) || 0}</td>
        <td>${parseFloat(student.total) || 0}</td>
        <td>${parseFloat(student.percentage).toFixed(2) + "%" || "0%"}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editStudent('${student.rollnumber}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('${student.rollnumber}')">Delete</button>
        </td>
      </tr>
    `;
  });
}


searched.addEventListener("input", function () {
  let searchText = searched.value.toLowerCase();
  let rows = document.querySelectorAll("#main tr");

  rows.forEach((row) => {
    let name = row.cells[1].textContent.toLowerCase();
    let rollNumber = row.cells[2].textContent.toLowerCase();

    if (name.includes(searchText) || rollNumber.includes(searchText)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

function newStudent() {
  Swal.fire({
    title: "Add New Student",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Roll Number">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Math">' +
      '<input id="swal-input4" class="swal2-input" placeholder="English">' +
      '<input id="swal-input5" class="swal2-input" placeholder="Urdu">' +
      '<input id="swal-input6" class="swal2-input" placeholder="Science">',
    showCancelButton: true,
    confirmButtonText: "Add Student",
    preConfirm: () => {
      const name = document.getElementById("swal-input1").value;
      const rollNumber = document.getElementById("swal-input2").value;
      const math = parseInt(document.getElementById("swal-input3").value) || 0;
      const eng = parseInt(document.getElementById("swal-input4").value) || 0;
      const urd = parseInt(document.getElementById("swal-input5").value) || 0;
      const sci = parseInt(document.getElementById("swal-input6").value) || 0;

      if (!name || !rollNumber) {
        Swal.showValidationMessage("Please enter valid data!");
        return false;
      }

      return { name, rollNumber, math, eng, urd, sci };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("http://localhost:5000/api/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.value),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Success!", "Student added successfully!", "success");
            fetchStudents();
          } else if (data.message === "Roll number already exists") {
            Swal.fire(
              "Warning!",
              "This roll number already exists!",
              "warning"
            );
          } else {
            Swal.fire("Error!", data.message, "error");
          }
        })
        .catch((error) => {
          Swal.fire("Error!", "Failed to add student!", "error");
        });
    }
  });
}

// 🟢 Edit Student Function 🟢
function editStudent(rollNumber) {
  fetch(`http://localhost:5000/api/students/${rollNumber}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const student = data.student;

        Swal.fire({
          title: "Edit Student",
          html:
            `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${student.name}">` +
            `<input id="swal-input3" class="swal2-input" placeholder="Math" value="${student.math}">` +
            `<input id="swal-input4" class="swal2-input" placeholder="English" value="${student.eng}">` +
            `<input id="swal-input5" class="swal2-input" placeholder="Urdu" value="${student.urd}">` +
            `<input id="swal-input6" class="swal2-input" placeholder="Science" value="${student.sci}">`,
          showCancelButton: true,
          confirmButtonText: "Update Student",
          preConfirm: () => {
            const name = document.getElementById("swal-input1").value;
            const math = parseFloat(document.getElementById("swal-input3").value) || 0;
            const eng = parseFloat(document.getElementById("swal-input4").value) || 0;
            const urd = parseFloat(document.getElementById("swal-input5").value) || 0;
            const sci = parseFloat(document.getElementById("swal-input6").value) || 0;


            // ✅ Validation: max value check
  const maxValue = 999; // ya jo bhi aapka DB limit ho
  if (math > maxValue || eng > maxValue || urd > maxValue || sci > maxValue) {
    Swal.showValidationMessage(`Marks cannot be greater than ${maxValue}`);
    return false; // prevents submission
  }
            return { name, math, eng, urd, sci };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`http://localhost:5000/api/students/update/${rollNumber}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(result.value),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  Swal.fire("Updated!", "Student record updated!", "success");
                  fetchStudents();
                } else {
                  Swal.fire("Error!", data.message, "error");
                }
              })
              .catch(() => {
                Swal.fire("Error!", "Failed to update student!", "error");
              });
          }
        });
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    })
    .catch(() => {
      Swal.fire("Error!", "Failed to fetch student data!", "error");
    });
}


function confirmDelete(rollNumber) {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:5000/api/students/delete/${rollNumber}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            let row = document.getElementById(`row-${rollNumber}`);
            if (row) row.remove();

            Swal.fire(
              "Deleted!",
              "The student record has been deleted.",
              "success"
            );
          } else {
            Swal.fire("Error!", data.message, "error");
          }
        })
        .catch((error) => {
          Swal.fire("Error!", "Failed to delete student!", "error");
        });
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        ).then(() => {
          window.location.href = "index.html";
        });
      }
    });
  });
}

fetchStudents();











// updated----
