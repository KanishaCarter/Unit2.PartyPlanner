// Stores the api url
const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2411-FTB-ET-WEB-PT/events';

// Stores the current list of events
let eventState = [];

// Fetch the event data from the API after the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);

// Fetch the list of events from the API and update the state
async function fetchEvents() {
  try {
    const response = await fetch(apiUrl); // GET request to fetch events
    const json = await response.json();   // Parse the JSON response
    eventState = json.data;               // Store the events in state
    renderEvents();                       // Render the list of events in the DOM
  } catch (error) {
    console.error("Error fetching events:", error); // Error handling
  }
}

// Renders all events from state to the page
function renderEvents() {
  const eventList = document.getElementById('party-list');
  eventList.innerHTML = ''; // Clear the current list before re-rendering

  eventState.forEach(event => {
    const eventItem = document.createElement('li');
    eventItem.innerHTML = `
      <strong>${event.name}</strong> - ${new Date(event.date).toLocaleDateString()} at ${event.location}<br>
      ${event.description}<br>
      <button onclick="deleteEvent('${event.id}')">Delete</button>
    `;
    eventList.appendChild(eventItem); // Add the item to the list in the DOM
  });
}

// Called when the "Add Event" form is submitted
async function addEvent(event) {
  event.preventDefault(); // Prevent the form from refreshing the page

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  const newEvent = { name, description, date: `${date}T${time}:00.000Z`, location };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });

    const result = await response.json();  // Get the new event back from the API
    eventState.push(result.data);          // Add the new event to our state
    renderEvents();                       // Re-render the event list
    event.target.reset();                  // Clear the form fields
  } catch (error) {
    console.error("Error adding event:", error);
  }
}

// Delete an event by ID and update state and DOM
async function deleteEvent(id) {
  try {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

    eventState = eventState.filter(event => event.id !== id);

    renderEvents();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}
