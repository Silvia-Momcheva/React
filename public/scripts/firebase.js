// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// За тази версия ползваме CDN в layout или index

// Инициализация на Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_5BBskpA1lKdv0FW-dCPlpOV8-jkLeSo",
    authDomain: "kursova-6d6cb.firebaseapp.com",
    projectId: "kursova-6d6cb",
    storageBucket: "kursova-6d6cb.firebasestorage.app",
    messagingSenderId: "259334044798",
    appId: "1:259334044798:web:c800c7001c5bf4df7fac2f"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  