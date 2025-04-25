document.addEventListener("DOMContentLoaded", () => {
    const flipButton = document.getElementById("flipCard");
    const nextButton = document.getElementById("nextCard");
    const prevButton = document.getElementById("prevCard");
    const selectElement = document.getElementById("setsSelect");
    const questionElement = document.querySelector(".question");
    const answerElement = document.querySelector(".answer");
    const cardElement = document.querySelector(".card");
  
    let currentCardIndex = 0;
    let shuffledCards = [];
  
     
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) return window.location.href = "/";
  
      const snapshot = await firebase.firestore()
        .collection("sets")
        .where("uid", "==", user.uid)
        .get();
  
      snapshot.forEach(doc => {
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = doc.data().title;
        selectElement.appendChild(option);
      });
    });
  
    selectElement.addEventListener("change", async (e) => {
      const setId = e.target.value;
      if (!setId) return;
  
      const doc = await firebase.firestore().collection("sets").doc(setId).get();
      const set = doc.data();
  
      shuffledCards = set.cards.sort(() => Math.random() - 0.5);
      currentCardIndex = 0;
      displayCard(shuffledCards[currentCardIndex]);
      cardElement.classList.remove("flipped");
    });
  
    function displayCard(card) {
      questionElement.textContent = card.question;
      answerElement.textContent = card.answer;
    }
  
    flipButton.addEventListener("click", () => {
      cardElement.classList.toggle("flipped");
    });
  
    nextButton.addEventListener("click", () => {
      if (currentCardIndex < shuffledCards.length - 1) {
        currentCardIndex++;
        displayCard(shuffledCards[currentCardIndex]);
        cardElement.classList.remove("flipped");
      } else {
        alert("End of the set!");
      }
    });
  
    prevButton.addEventListener("click", () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        displayCard(shuffledCards[currentCardIndex]);
        cardElement.classList.remove("flipped");
      }
    });
  });
  