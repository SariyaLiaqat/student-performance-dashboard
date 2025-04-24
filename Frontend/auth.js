
document.addEventListener("DOMContentLoaded", function () {
    // 🟢 LOGIN FORM EVENT
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // ✅ Prevent form refresh

            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            fetch("http://localhost:5000/api/auth/login", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("authToken", data.token);  
                    localStorage.setItem("username", username);

                    Swal.fire({
                        title: 'Enter Your Secret ID',
                        input: 'password',
                        inputLabel: 'Secret ID',
                        inputPlaceholder: 'Enter your secret ID',
                        inputAttributes: {
                            autocapitalize: 'off',
                            autocomplete: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Submit',
                        showLoaderOnConfirm: true,
                        preConfirm: (secretID) => {
                            return new Promise((resolve, reject) => {
                                if (secretID === 'GCUF_Secret_2025') {
                                    resolve();
                                } else {
                                    reject();
                                }
                            });
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "dashboard.html";
                        } else {
                            localStorage.removeItem("authToken");
                            localStorage.removeItem("username");
                            window.location.href = "loginPage.html";
                        }
                    }).catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Don\'t try to enter wrong ID 😤',
                            text: 'Access Denied!',
                            confirmButtonText: 'Okay'
                        });
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("username");
                    });

                } else if (data.message.includes("Register yourself first")) {
                    alert("❌ User not registered! Redirecting to Registration Page...");
                    window.location.href = "registerPage.html";
                } else {
                    alert("❌ Invalid Credentials");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("❌ Server Error. Try again later.");
            });
        });
    }

    // 🟢 REGISTER FORM EVENT
    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault(); // ✅ Prevent form refresh

            var username = document.getElementById("regUsername").value;
            var password = document.getElementById("regPassword").value;

            // 🔐 Password Validation
            var passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(password)) {
                alert("❌ Password must be at least 8 characters long and include:\n- One uppercase letter\n- One number\n- One special character.");
                return;
            }

            fetch("http://localhost:5000/api/auth/register", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("✅ Registration Successful! Redirecting to Login...");
                    window.location.href = "loginPage.html";
                } else {
                    alert("❌ User already exists.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("❌ Server Error. Try again later.");
            });
        });
    }
});
