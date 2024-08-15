import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

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
console.log(username)

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = '../auth/login.html';
    }
});

async function displayEventsForUser(username) {
    const eventsContainer = document.getElementById('events-list');
    eventsContainer.innerHTML = '';

    try {
        const eventsRef = collection(database, 'events');
        const q = query(eventsRef, where('user', '==', username));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventDateStr = eventData.date;
            const [day, month, year] = eventDateStr.split('/');
            const dateObj = new Date(`${year}-${month}-${day}`);

            if (isNaN(dateObj.getTime())) {
                console.error('Invalid Date:', eventDateStr);
                return;
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (dateObj < currentDate) {
                return;
            }

            const eventDateString = dateObj.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.textContent = `${eventDateString}: ${eventData.name}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'delete-event-button';
            deleteButton.addEventListener('click', async () => {
                await deleteEvent(doc.id);
            });

            eventItem.appendChild(deleteButton);
            eventsContainer.appendChild(eventItem);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function deleteEvent(eventId) {
    try {
        await deleteDoc(doc(database, 'events', eventId));
        displayEventsForUser(username);
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayEventsForUser(username);
});

document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = '../auth/login.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});