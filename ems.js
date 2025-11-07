const DB_KEY = 'weelabs_catering_db';
const seedData = [
    { id: 'Event1', name: 'Alice', email: 'aliceDeguzman@gmail.com', contact: '09352644489', date: 'June 24', venue: 'Marikina Hall', guest: '30-50' },
    { id: 'Event2', name: 'Ben', email: 'benbeckman@gmail.com', contact: '09563215489', date: 'June 26', venue: 'El Hotel', guest: '50' },
    { id: 'Event3', name: 'Ashley', email: 'Ashleyspitback@gmail.com', contact: '09263597789', date: 'July 14', venue: 'Eve Palace', guest: '70' }
];

let db = [];
let editMode = null;

// Load database
function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
        try {
            db = JSON.parse(raw);
        } catch (e) {
            console.error("Failed to parse DB, resetting.", e);
            db = [...seedData];
            saveDB();
        }
    } else {
        db = [...seedData];
        saveDB();
    }

    if (document.getElementById("recordstable")) {
        displayRecords();
    }
}

// Save database
function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Save or edit record
function saveBook() {
    const id = document.getElementById("idInput").value.trim();
    const name = document.getElementById("NameInput").value.trim();
    const email = document.getElementById("EmailInput").value.trim();
    const contact = document.getElementById("ContactInput").value.trim();
    const date = document.getElementById("EventDInput").value.trim();
    const venue = document.getElementById("EventVenInput").value.trim();
    const guest = document.getElementById("GuestInput").value.trim();

    if (!name || !email || !contact || !date || !venue || !guest) {
        alert("Please fill out all fields.");
        return;
    }

    if (editMode) {
        const idx = db.findIndex(r => r.id === editMode);
        if (idx !== -1) {
            db[idx] = { id, name, email, contact, date, venue, guest };
        }
        editMode = null;
    } else {
        const newRecord = {
            id: `Event${Date.now()}`,
            name, email, contact, date, venue, guest
        };
        db.push(newRecord);
    }

    saveDB();
    displayRecords();
    document.getElementById("bookingForm").reset();
}

// Delete a record
function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        db = db.filter(r => r.id !== id);
        saveDB();
        displayRecords();
    }
}

// Display records
function displayRecords(records = db) {
    const table = document.getElementById("recordstable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Contact</th>
            <th>Date</th><th>Venue</th><th>Guests</th><th>Actions</th>
        </tr>`;

    records.forEach(r => {
        table.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>${r.email}</td>
                <td>${r.contact}</td>
                <td>${r.date}</td>
                <td>${r.venue}</td>
                <td>${r.guest}</td>
                <td>
                    <button onclick="EditRecord('${r.id}')">Edit</button>
                    <button onclick="deleteRecord('${r.id}')">Delete</button>
                </td>
            </tr>`;
    });
}

// Edit a record
function EditRecord(id) {
    const record = db.find(r => r.id === id);
    if (!record) {
        alert("Record not found.");
        return;
    }

    document.getElementById("idInput").value = record.id;
    document.getElementById("NameInput").value = record.name;
    document.getElementById("EmailInput").value = record.email;
    document.getElementById("ContactInput").value = record.contact;
    document.getElementById("EventDInput").value = record.date;
    document.getElementById("EventVenInput").value = record.venue;
    document.getElementById("GuestInput").value = record.guest;

    editMode = id;
}

// Search
function searchRecords() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = db.filter(r =>
        r.id.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.venue.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query)
    );
    displayRecords(filtered);
}

// Simple Login
function LoginAcc() {
    const user = document.getElementById("UserNameInput").value.trim();
    const pass = document.getElementById("Password").value.trim();

    if (user === "Admin001" && pass === "12345") {
        alert("Login successful!");
        window.location.href = "admin.html";
    } else {
        alert("Invalid credentials. Try again.");
    }
}

window.onload = loadDB;
