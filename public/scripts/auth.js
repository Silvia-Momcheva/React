 

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
  
        auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            window.location.href = "/dashboard";
          })
          .catch((err) => {
            message.textContent = "Login error: " + err.message;
          });
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = registerForm.email.value;
        const password = registerForm.password.value;
  
        auth.createUserWithEmailAndPassword(email, password)
          .then(() => {
            window.location.href = "/dashboard";
          })
          .catch((err) => {
            message.textContent = "Registration error:: " + err.message;
          });
      });
    }
  });
  