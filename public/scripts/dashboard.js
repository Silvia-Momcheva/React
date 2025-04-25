document.addEventListener("DOMContentLoaded", () => {
    const setsList = document.getElementById("setsList");
    const newSetForm = document.getElementById("newSetForm");
    const showCreateSetFormBtn = document.getElementById("showCreateSetForm");
    const logoutBtn = document.getElementById("logoutBtn");
  
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalCards = document.getElementById("modalCards");
    const closeModalBtn = document.getElementById("closeModal");
    const closeModalBtn2 = document.getElementById("close2Modal");
    const addCardForm = document.getElementById("addCardForm");
  
    let currentSetId = null;
    let currentSetCards = [];
  
    showCreateSetFormBtn.addEventListener("click", () => {
      newSetForm.classList.remove("hidden");
      showCreateSetFormBtn.classList.add("hidden");
    });
  
    newSetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = newSetForm.title.value.trim();
      const cardsRaw = newSetForm.cards.value.trim();
  
      const cards = cardsRaw.split("\n").map(line => {
        const [question, answer] = line.split(" - ");
        return { question: question?.trim(), answer: answer?.trim() };
      }).filter(card => card.question && card.answer);
  
      const docRef = await firebase.firestore().collection("sets").add({
        title,
        cards,
        uid: firebase.auth().currentUser.uid,
        createdAt: Date.now()
      });
  
      newSetForm.reset();
      newSetForm.classList.add("hidden");
      showCreateSetFormBtn.classList.remove("hidden");
      loadSets(firebase.auth().currentUser.uid);
    });
  
    function renderCards() {
      modalCards.innerHTML = "";
      currentSetCards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = " bg-gray-100 rounded-lg shadow flex justify-between items-start";
  
        const content = document.createElement("p");
        content.textContent = `• ${card.question} → ${card.answer}`;
        content.className = "text-gray-700";
  
        const actions = document.createElement("div");
        actions.className = "space-x-2";
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.className = "text-blue-500 hover:text-blue-700";
        editBtn.addEventListener("click", () => {
          const form = document.createElement("form");
          form.className = "flex flex-col space-y-2 w-full";
  
          form.innerHTML = `
            <input type="text" name="question" value="${card.question}" class="p-2 border rounded" required />
            <input type="text" name="answer" value="${card.answer}" class="p-2 border rounded" required />
            <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 self-start">Запази</button>
          `;
  
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newQuestion = form.question.value.trim();
            const newAnswer = form.answer.value.trim();
  
            currentSetCards[index] = { question: newQuestion, answer: newAnswer };
  
            await firebase.firestore().collection("sets").doc(currentSetId).update({
              cards: currentSetCards,
            });
  
            renderCards();
          });
  
          cardDiv.innerHTML = "";
          cardDiv.appendChild(form);
        });
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "text-red-500 hover:text-red-700";
        deleteBtn.addEventListener("click", async () => {
          currentSetCards.splice(index, 1);
          await firebase.firestore().collection("sets").doc(currentSetId).update({
            cards: currentSetCards,
          });
          renderCards();
        });
  
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
  
        cardDiv.appendChild(content);
        cardDiv.appendChild(actions);
  
        modalCards.appendChild(cardDiv);
      });
  
      
      const addCardBtn = document.createElement("button");
      addCardBtn.textContent = "Add new card";
      addCardBtn.className = "bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition";
      addCardBtn.addEventListener("click", () => {
        addCardForm.classList.remove("hidden");
      });
      modalCards.appendChild(addCardBtn);
    }
  
    function showSetModal(set, id) {
      currentSetId = id;
      currentSetCards = [...set.cards];
  
      modalTitle.textContent = set.title;
      renderCards();
      modal.classList.remove("hidden");
      addCardForm.classList.add("hidden");
    }
  
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      addCardForm.classList.add("hidden");
    });
    closeModalBtn2.addEventListener("click", () => {
      modal.classList.add("hidden");
      addCardForm.classList.add("hidden");
    });
    addCardForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const question = addCardForm.question.value.trim();
      const answer = addCardForm.answer.value.trim();
  
      if (!question || !answer) return;
  
      currentSetCards.push({ question, answer });
  
      await firebase.firestore().collection("sets").doc(currentSetId).update({
        cards: currentSetCards,
      });
  
      addCardForm.reset();
      addCardForm.classList.add("hidden");
      renderCards();
    });
  
    async function loadSets(uid) {
      const snapshot = await firebase.firestore()
        .collection("sets")
        .where("uid", "==", uid)
        .get();
  
      setsList.innerHTML = "";
  
      snapshot.forEach((doc) => {
        const set = doc.data();
  
        const li = document.createElement("li");
        li.className = "bg-white rounded-2xl border-4 border-purple-300 p-4 shadow-xl transform hover:scale-105 transition cursor-pointer";
  
        const h3Wrapper = document.createElement("div");
        h3Wrapper.className = "flex justify-between items-center";
  
        const h3 = document.createElement("h3");
        h3.textContent = set.title;
        h3.className = "text-xl font-bold text-gray-800";
  
        const deleteSetBtn = document.createElement("button");
        deleteSetBtn.textContent = "✕";
        deleteSetBtn.className = "text-red-500 text-xl hover:text-red-700";
        deleteSetBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this set?")) {
            await firebase.firestore().collection("sets").doc(doc.id).delete();
            loadSets(uid);
          }
        });
  
        h3Wrapper.appendChild(h3);
        h3Wrapper.appendChild(deleteSetBtn);
  
        li.appendChild(h3Wrapper);
        setsList.appendChild(li);
  
        h3.addEventListener("click", () => {
          showSetModal(set, doc.id);
        });
      });
    }
  
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        loadSets(user.uid);
      } else {
        window.location.href = "/";
      }
    });
  
    logoutBtn.addEventListener("click", async () => {
      try {
        await firebase.auth().signOut();
        window.location.href = "/";
      } catch (error) {
        console.error("Logout error: ", error);
      }
    });
  });
  