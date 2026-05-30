// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyA2P_u7TeZuVYBbs1cAuML414LVGIWxZTw",
//   authDomain: "moodlyai-7a011.firebaseapp.com",
//   projectId: "moodlyai-7a011",
//   storageBucket: "moodlyai-7a011.firebasestorage.app",
//   messagingSenderId: "301553702453",
//   appId: "1:301553702453:web:8e2ef3150d0b115bf5037c",
//   measurementId: "G-4QGQTPR9R4"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   prompt: "select_account"   // 👈 EH ADD KARNA
// });



// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2P_u7TeZuVYBbs1cAuML414LVGIWxZTw",
  authDomain: "moodlyai-7a011.firebaseapp.com",
  projectId: "moodlyai-7a011",
  storageBucket: "moodlyai-7a011.appspot.com",
  messagingSenderId: "301553702453",
  appId: "1:301553702453:web:8e2ef3150d0b115bf5037c",
  measurementId: "G-4QGQTPR9R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // always prompt account selection

// Export **only once**
export { auth, provider };