import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';

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

document.addEventListener('DOMContentLoaded', () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentDay = dayNames[currentDate.getDay()];
    
    document.getElementById('current-month').textContent = currentMonth;
    document.getElementById('current-day').textContent = currentDay;
});


document.addEventListener("DOMContentLoaded", function() {
    const calendarGrid = document.getElementById("calendar-grid");
    const eventModal = document.getElementById("event-modal");
    const eventInput = document.getElementById("event-input");
    const selectedDateElem = document.getElementById("selected-date");
    const saveEventBtn = document.getElementById("save-event");

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const events = {};

    for (let i = 0; i < firstDay; i++) {
        const blankCell = document.createElement("div");
        calendarGrid.appendChild(blankCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement("div");
        dayCell.textContent = i;
        dayCell.addEventListener("click", () => {
            selectedDateElem.textContent = `${i}/${month + 1}/${year}`;
            eventModal.classList.remove("hidden");

            eventInput.value = events[i] || "";

            saveEventBtn.onclick = function() {
                events[i] = eventInput.value;
                eventModal.classList.add("hidden");
            };
        });
        calendarGrid.appendChild(dayCell);
    }
});

const eventModal = document.getElementById('event-modal');
const cancelEventButton = document.getElementById('cancel-event');
const saveEventButton = document.getElementById('save-event');
const selectedDateElement = document.getElementById('selected-date');
const eventInput = document.getElementById('event-input');

function openEventModal(date) {
    selectedDateElement.textContent = date;
    eventInput.value = '';
    eventModal.classList.remove('hidden');
}

function closeEventModal() {
    eventModal.classList.add('hidden');
}

cancelEventButton.addEventListener('click', closeEventModal);

document.querySelectorAll('.date').forEach(dateElement => {
    dateElement.addEventListener('click', () => {
        const date = dateElement.getAttribute('data-date');
        openEventModal(date);
    });
});

saveEventButton.addEventListener('click', () => {
    const eventName = document.getElementById('event-input').value;
    const date = document.getElementById('selected-date').textContent;

    if (eventName) {
        const username = localStorage.getItem('username');
        if (username) {
            saveEventToFirestore(date, eventName, username);
            closeEventModal();
        } else {
            alert('No username found in local storage.');
        }
    } else {
        alert("Please enter an event name.");
    }
});

async function saveEventToFirestore(eventDate, eventName, username) {
    try {
        const eventRef = collection(database, 'events');
        await addDoc(eventRef, {
            date: eventDate,
            name: eventName,
            user: username
        });
        console.log('Event saved successfully!');
    } catch (error) {
        console.error('Error saving event:', error);
    }
}
