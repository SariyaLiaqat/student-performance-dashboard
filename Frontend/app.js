
var main = document.getElementById('main'); 
var searched = document.getElementById("search");

// Students data fetch karne ka function
function fetchStudents() {
    fetch("http://localhost:5000/api/students/all")
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", JSON.stringify(data, null, 2));
            if (data.success && Array.isArray(data.students)) {
                updateTable(data.students);
            } else {
                console.error("Invalid data format received:", data);
            }
        })
        .catch(error => console.error("Error fetching students:", error));
}

function updateTable(students) {
    main.innerHTML = '';
    students.forEach((student, index) => {
        main.innerHTML += `
          <tr id="row-${student.ROLLNUMBER}">
            <td>${index + 1}</td>
            <td>${student.NAME || 'N/A'}</td>
            <td>${student.ROLLNUMBER || 'N/A'}</td>
            <td>${student.MATH || 0}</td>
            <td>${student.ENG || 0}</td>
            <td>${student.URD || 0}</td>
            <td>${student.SCI || 0}</td>
            <td>${student.TOTAL || 0}</td>
            <td>${student.PERCENTAGE ? student.PERCENTAGE.toFixed(2) + '%' : '0%'}</td>
            <td><button class="btn btn-danger" onclick="confirmDelete('${student.ROLLNUMBER}')">Delete</button></td>
          </tr>
        `;
    });
}

// 🟢 Search Function 🟢
searched.addEventListener("input", function () {
    let searchText = searched.value.toLowerCase();
    let rows = document.querySelectorAll("#main tr");

    rows.forEach(row => {
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
        title: 'Add New Student',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Roll Number">' +
            '<input id="swal-input3" class="swal2-input" placeholder="Math">' +
            '<input id="swal-input4" class="swal2-input" placeholder="English">' +
            '<input id="swal-input5" class="swal2-input" placeholder="Urdu">' +
            '<input id="swal-input6" class="swal2-input" placeholder="Science">',
        showCancelButton: true,
        confirmButtonText: 'Add Student',
        preConfirm: () => {
            const name = document.getElementById('swal-input1').value;
            const rollNumber = document.getElementById('swal-input2').value;
            const math = parseInt(document.getElementById('swal-input3').value) || 0;
            const eng = parseInt(document.getElementById('swal-input4').value) || 0;
            const urd = parseInt(document.getElementById('swal-input5').value) || 0;
            const sci = parseInt(document.getElementById('swal-input6').value) || 0;

            if (!name || !rollNumber) {
                Swal.showValidationMessage('Please enter valid data!');
                return false;
            }

            return { name, rollNumber, math, eng, urd, sci };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("http://localhost:5000/api/students/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire("Success!", "Student added successfully!", "success");
                    fetchStudents();
                } else if (data.message === "Roll number already exists") {
                    Swal.fire("Warning!", "This roll number already exists!", "warning");
                } else {
                    Swal.fire("Error!", data.message, "error");
                }
            })
            .catch(error => {
                Swal.fire("Error!", "Failed to add student!", "error");
            });
        }
    });
}

function confirmDelete(rollNumber) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!", 
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:5000/api/students/delete/${rollNumber}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let row = document.getElementById(`row-${rollNumber}`);
                    if (row) row.remove();

                    Swal.fire('Deleted!', 'The student record has been deleted.', 'success');
                } else {
                    Swal.fire("Error!", data.message, "error");
                }
            })
            .catch(error => {
                Swal.fire("Error!", "Failed to delete student!", "error");
            });
        }
    });
}

// 🔴 Logout Button Functionality 🔴
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
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("authToken");
                Swal.fire("Logged Out!", "You have been logged out successfully.", "success").then(() => {
                    window.location.href = "LoginPage.html";
                });
            }
        });
    });
}

// 🔃 Page Load Pe Data Fetch
fetchStudents();
