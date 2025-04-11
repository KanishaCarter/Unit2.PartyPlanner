// ✅ Replace with your actual cohort name!
const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/your-cohort-name/parties';

// This will hold our current list of parties so we can keep track of and render them.
let partyState = [];

// When the page loads, fetch the party data from the API
document.addEventListener('DOMContentLoaded', fetchParties);

// Fetch the list of parties from the API and update the state
async function fetchParties() {
  try {
    const response = await fetch(apiUrl); // GET request to fetch parties
    const json = await response.json();   // Parse the JSON response
    partyState = json.data;               // Store the party list in state
    renderParties();                      // Render the list of parties in the DOM
  } catch (error) {
    console.error("Error fetching parties:", error); // Error handling
  }
}

// Renders all parties from state to the page
function renderParties() {
  const partyList = document.getElementById('party-list');
  partyList.innerHTML = ''; // Clear the current list before re-rendering

  partyState.forEach(party => {
    // Create an <li> for each party
    const partyItem = document.createElement('li');
    partyItem.innerHTML = `
      <strong>${party.name}</strong> - ${party.date} at ${party.time}<br>
      Location: ${party.location}<br>
      ${party.description}<br>
      <button onclick="deleteParty('${party.id}')">Delete</button>
    `;
    partyList.appendChild(partyItem); // Add the item to the list in the DOM
  });
}

// Called when the "Add Party" form is submitted
async function addParty(event) {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get values from input fields
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  // Create a new party object
  const newParty = { name, date, time, location, description };

  try {
    // Send POST request to create the new party
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParty)
    });

    const result = await response.json();  // Get the new party back from the API
    partyState.push(result.data);          // Add the new party to our state
    renderParties();                       // Re-render the party list
    event.target.reset();                  // Clear the form fields
  } catch (error) {
    console.error("Error adding party:", error);
  }
}

// Delete a party by ID and update state and DOM
async function deleteParty(id) {
  try {
    // Send DELETE request to remove the party
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

    // Remove the deleted party from state
    partyState = partyState.filter(party => party.id !== id);

    // Re-render the party list without the deleted one
    renderParties();
  } catch (error) {
    console.error("Error deleting party:", error);
  }
}
