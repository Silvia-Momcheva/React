document.addEventListener("DOMContentLoaded", () => {
    console.log("The homepage has been loaded!");
  
    const logoutBtn = document.getElementById("logoutBtn");
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await firebase.auth().signOut();
          window.location.href = "/";
        } catch (error) {
          console.error("Logout error: ", error);
        }
      });
    } else {
      console.warn("logoutBtn not found in the DOM.");
    }
  });
  