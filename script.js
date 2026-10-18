
const registerSection = document.getElementById("registerSection");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const message = document.getElementById("message");

let demoAccount = null;
let failedAttempts = 0;
let lockedUntil = 0;

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = type;
}

function showSection(section) {
    registerSection.hidden = section !== "register";
    loginSection.hidden = section !== "login";
    dashboardSection.hidden = section !== "dashboard";
    showMessage("");
}

document.getElementById("showLogin").addEventListener("click", () => {
    showSection("login");
});

document.getElementById("showRegister").addEventListener("click", () => {
    showSection("register");
});

// Password visibility
document.querySelectorAll(".toggle").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
    });
});

// Password strength indicator
const regPassword = document.getElementById("regPassword");

regPassword.addEventListener("input", () => {
    const password = regPassword.value;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");

    bar.style.width = (score * 20) + "%";

    const labels = [
        "Very weak",
        "Very weak",
        "Weak",
        "Fair",
        "Good",
        "Strong"
    ];

    text.textContent = "Password strength: " + labels[score];
});

// Registration
document.getElementById("registerForm").addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        const password = regPassword.value;
        const confirmation = document.getElementById("confirmPassword").value;

        if (!name || !email || !password) {
            showMessage("Please complete all fields.", "error");
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.", "error");
            return;
        }

        if (password !== confirmation) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        // Demo only: do not use this in a real application.
        // No password or account is persisted.
        demoAccount = { name, email, password };

        document.getElementById("loginEmail").value = email;
        document.getElementById("loginPassword").value = "";

        showSection("login");
        showMessage(
            "Demo account created in memory. Log in before refreshing the page.",
            "success"
        );
    }
);

// Login
document.getElementById("loginForm").addEventListener(
    "submit",
    event => {
        event.preventDefault();

        if (Date.now() < lockedUntil) {
            showMessage("Too many attempts. Please wait before retrying.", "error");
            return;
        }

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        if (!demoAccount ||
            email !== demoAccount.email ||
            password !== demoAccount.password) {

            failedAttempts++;

            if (failedAttempts >= 5) {
                lockedUntil = Date.now() + 30000;
                failedAttempts = 0;

                showMessage(
                    "Too many attempts. Wait 30 seconds before trying again.",
                    "error"
                );
            } else {
                showMessage("Invalid email or password.", "error");
            }

            return;
        }

        failedAttempts = 0;

        document.getElementById("welcomeName").textContent = demoAccount.name;

        showSection("dashboard");
        showMessage("Demo login successful.", "success");
    }
);

// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
    showSection("login");
    document.getElementById("loginPassword").value = "";
    showMessage("You have logged out of the demo.", "success");
});
