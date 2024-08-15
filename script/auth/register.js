import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVwrsoLmW_Df2o3qKoeX5sVXMHTHIxMvQ",
    authDomain: "mikey-digital-planner.firebaseapp.com",
    projectId: "mikey-digital-planner",
    storageBucket: "mikey-digital-planner.appspot.com",
    messagingSenderId: "1075721530561",
    appId: "1:1075721530561:web:5b5b90645889de55ef3840",
    measurementId: "G-9CTMB7JBL2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getFirestore(app);

const button = document.getElementById("btn");

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        button.click();
    }
})

button.addEventListener('click', async function() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: username
        });

        await setDoc(doc(database, "usernames", username), {
            email: email
        });

        console.log("User signed up successfully:", username);
        window.location.href = "../auth/login.html";

    } catch (error) {
        console.error("Error signing up:", error.message);
    }
})
