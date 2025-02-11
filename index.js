// Basic Event Tracker App

const apiUrl = 'https://example.com/api/parties'; // Replace with actual API endpoint

// Fetch and display parties when page loads
document.addEventListener('DOMContentLoaded', fetchParties);

async function fetchParties() {
    const response = await fetch(apiUrl);
    const parties = await response.json();
    renderParties(parties);
}

function renderParties(parties) {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = ''; // Clear existing list
    parties.forEach(party => {
        const partyItem = document.createElement('li');
        partyItem.innerHTML = `<strong>${party.name}</strong> - ${party.date} at ${party.time}<br>
            Location: ${party.location}<br>
            ${party.description} <br>
            <button onclick="deleteParty('${party.id}')">Delete</button>`;
        partyList.appendChild(partyItem);
    });
}

async function addParty(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;

    const newParty = { name, date, time, location, description };
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParty)
    });
    
    if (response.ok) fetchParties();
}

async function deleteParty(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchParties();
}
