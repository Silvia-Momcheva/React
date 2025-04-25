document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.getElementById("setsSelect");
    const nextButton = document.getElementById("nextQuestion");
    const questionElement = document.querySelector(".question");
    const optionsContainer = document.querySelector(".options");
    const resultContainer = document.getElementById("result");
    const progressBar = document.getElementById("progressBar"); 
    const progressText = document.getElementById("progressText");  
    const questionCounter = document.getElementById("questionCounter");  
  
    let currentQuestion = 0;  
    let currentSet = null;
    let shuffledQuestions = [];
    let score = 0;
  
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
  
      
      currentQuestion = 0;  
      score = 0;
      resultContainer.textContent = "";
      nextButton.disabled = false;
  
       
      const doc = await firebase.firestore().collection("sets").doc(setId).get();
      currentSet = doc.data();
      shuffledQuestions = currentSet.cards.sort(() => Math.random() - 0.5);  
  
      displayQuestion(shuffledQuestions[currentQuestion]);
      updateProgressBar();  
      updateQuestionCounter(); 
    });
  
    function displayQuestion(card) {
      questionElement.textContent = card.question;
      optionsContainer.innerHTML = "";
  
      const correctAnswer = card.answer;
      const wrongAnswers = currentSet.cards
        .filter(c => c.answer !== correctAnswer)
        .map(c => c.answer);
  
      const randomWrongAnswers = shuffleArray(wrongAnswers).slice(0, 3);
      const allOptions = shuffleArray([correctAnswer, ...randomWrongAnswers]);
  
      allOptions.forEach(option => {
        const label = document.createElement("label");
        label.className = "block mb-2 cursor-pointer";
  
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = option;
        input.className = "mr-2";
  
        label.appendChild(input);
        label.append(option);
        optionsContainer.appendChild(label);
      });
    }
  
    nextButton.addEventListener("click", () => {
      const selectedInput = document.querySelector("input[name='answer']:checked");
      if (!selectedInput) {
        alert("Please select an answer.");
        return;
      }
  
      const selectedAnswer = selectedInput.value;
      const correctAnswer = shuffledQuestions[currentQuestion].answer;
      if (selectedAnswer === correctAnswer) score++;
  
      currentQuestion++;
      if (currentQuestion < shuffledQuestions.length) {
        displayQuestion(shuffledQuestions[currentQuestion]);
        updateProgressBar();  
        updateQuestionCounter();  
      } else {
        questionElement.textContent = "The test is over!";
        optionsContainer.innerHTML = "";
        nextButton.disabled = true;
        resultContainer.textContent = `Result: ${score} out of ${shuffledQuestions.length}`;
        updateProgressBar();  
        updateQuestionCounter();  
      }
    });
   
    function updateProgressBar() {
      const progressPercent = (currentQuestion / shuffledQuestions.length) * 100;
      progressBar.style.width = `${progressPercent}%`;
      progressText.textContent = `Progress: ${Math.round(progressPercent)}%`;  
  
      if (currentQuestion === shuffledQuestions.length) {
        progressBar.style.width = "100%";
        progressText.textContent = "Progress: 100%";  
      }
    }
  
     
    function updateQuestionCounter() {
        const currentNumber = Math.min(currentQuestion + 1, shuffledQuestions.length);
        questionCounter.textContent = `Question ${currentNumber} of ${shuffledQuestions.length}`;
      }
      
  
    function shuffleArray(arr) {
      return [...arr].sort(() => Math.random() - 0.5);
    }
  });
  