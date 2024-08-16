import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"

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
const database = getFirestore(app);
const auth = getAuth(app);

const username = localStorage.getItem('username');

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is authenticated:', user.uid);
    } else {
        console.log('No authenticated user found. Redirecting to login.');
        window.location.href = '../auth/login.html';
    }
});

const form = document.getElementById('create-task-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDeadline = document.getElementById('task-deadline').value;

    if (taskName && taskDescription) {
        try {
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(database, 'tasks'), {
                    name: taskName,
                    description: taskDescription,
                    deadline: taskDeadline,
                    user: username,
                    status: 'uncompleted'
                });
                
                form.reset();
            } else {
                console.log('No user is signed in');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
});