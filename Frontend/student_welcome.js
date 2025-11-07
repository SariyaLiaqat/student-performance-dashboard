
function showResultPopup() {
  Swal.fire({
    title: "Enter Your Roll Number",
    input: "text",
    inputPlaceholder: "Enter Roll Number",
    showCancelButton: true,
    confirmButtonText: "Check Result",
    showLoaderOnConfirm: true,
    preConfirm: async (rollNo) => {
      if (!rollNo) {
        Swal.showValidationMessage("Roll number cannot be empty!");
        return false;
      }

      try {
        const response = await fetch("http://localhost:5000/api/student-result/view-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rollNumber: rollNo }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Result not found!");
        }

        return data;
      } catch (error) {
        Swal.showValidationMessage(error.message);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
  if (result.isConfirmed && result.value) {
    const data = result.value.student; // ✅ Access the 'student' object correctly

    Swal.fire({
      icon: "success",
      title: "Result Found!",
      html: `
        <b>Roll No:</b> ${data.rollNumber}<br/>
        <b>Name:</b> ${data.name}<br/>
        <b>Total:</b> ${data.total}<br/>
        <b>Percentage:</b> ${data.percentage}%<br/><br/>
        <canvas id="resultChart" width="300" height="200"></canvas><br/>
        <button id="logoutBtn" class="btn btn-danger">Logout</button>
      `,
      didRender: () => {
        const ctx = document.getElementById("resultChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Math", "English", "Urdu", "Science"],
            datasets: [
              {
                label: "Marks",
                data: [data.math, data.eng, data.urd, data.sci], // ✅ use individual subject fields
                backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          },
        });

        document.getElementById("logoutBtn").addEventListener("click", () => {
          window.location.href = "loginPage.html";
        });
      },
      showConfirmButton: false,
    });
  }
});


}
