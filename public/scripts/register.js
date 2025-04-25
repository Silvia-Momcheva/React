 

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("Registration successful!");
        window.location.href = "/home";  
      } catch (err) {
        alert("Registration error: " + err.message);
      }
    });
  });
  