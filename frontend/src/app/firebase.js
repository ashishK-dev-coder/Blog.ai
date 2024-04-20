// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHTtCp6KBmAdELbQH-x1Iuw7slutZp1rw",
  authDomain: "blog-project-727bd.firebaseapp.com",
  projectId: "blog-project-727bd",
  storageBucket: "blog-project-727bd.appspot.com",
  messagingSenderId: "30590145056",
  appId: "1:30590145056:web:4c727f686a540477f5a245",
  measurementId: "G-0FEEDBPDNF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);