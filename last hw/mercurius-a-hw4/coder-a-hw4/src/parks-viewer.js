import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

// park look up
const parks = {
    "p79": "Letchworth State Park",
    "p20": "Hamlin Beach State Park",
    "p180": "Brookhaven State Park",
    "p35": "Allan H. Treman State Marine Park",
    "p118": "Stony Brook State Park",
    "p142": "Watkins Glen State Park",
    "p62": "Taughannock Falls State Park",
    "p84": "Selkirk Shores State Park",
    "p43": "Chimney Bluffs State Park",
    "p200": "Shirley Chisholm State Park",
    "p112": "Saratoga Spa State Park"
};

// Updates the page when Firebase data changes
const favoritesChanged = (snapshot) => {
    const list = document.querySelector("ol"); // your favorites list <ol>
    list.innerHTML = ""; // Clear list

    snapshot.forEach(fav => {
        const id = fav.key;
        const data = fav.val();
        if (data.likes > 0) {
            const li = document.createElement("li");
            li.textContent = `${parks[id]} (${id}) — Likes: ${data.likes}`;
            list.appendChild(li);
        }
    });
};

// Start listening for changes
const init = () => {
    const favRef = ref(db, "favorite-parks/");
    onValue(favRef, favoritesChanged);
};

init();