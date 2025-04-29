import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment } from "https://www.gstatic.com/firebasejs/LINK-TO-LATEST-VERSION-FIREBASE.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    // PUT YER CREDENTIALS HERE
    apiKey: "AIzaSyBh0QgLqQU6p96CQWwGfL1yxPgo0h0IriM",
    authDomain: "high-scores-471ff.firebaseapp.com",
    projectId: "high-scores-471ff",
    storageBucket: "high-scores-471ff.firebasestorage.app",
    messagingSenderId: "953529628769",
    appId: "1:953529628769:web:18e700882c5242f3fc5220"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const db = getDatabase();

const likedDogsPath = "df-liked-dogs/";

const pushLikedDogToCloud = dog => {
    dog.likes = increment(1);
    const favRef = ref(db, `${likedDogsPath}${dog.hash}`);
    set(favRef, dog); // `dog` is an object with `.title`, `.url`, `.likes` properties etc
};

// You might get awway with exporting fewer functions than this
export { db, likedDogsPath, ref, set, push, pushLikedDogToCloud, onValue };