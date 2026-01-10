const form = document.getElementById("authorityLoginForm");
    const errorBox = document.getElementById("authority_error");
    const loginButton = document.getElementById("loginButton");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.style.display = "none";
      loginButton.classList.add("loading");
      loginButton.disabled = true;

      const email = document.getElementById("authority_email").value.trim();
      const password = document.getElementById("authority_password").value;

      try {
        const response = await fetch(
          "https://quiethelp-backend.onrender.com/authority/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        // Store demo token
        localStorage.setItem("authority_token", data.token);

        // Redirect to dashboard
        window.location.href = "authority-dashboard.html";

      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = "block";
        loginButton.classList.remove("loading");
        loginButton.disabled = false;
      }
    });
      // Disable right click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Disable key shortcuts
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
    }
  });