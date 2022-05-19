import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = 'http://localhost:4000/guests';
  // get guest from base url (localhost:4000)
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(baseUrl);
      const data = await response.json();
      setGuestList(data);
      setIsLoading(false);
    }

    fetchData().catch(() => {});
  }, []);
  //
  // create/add new guest
  const addNewGuest = async () => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const addedGuest = await response.json();
    setGuestList([...guestList, addedGuest]);
  };
  //
  // submit names and prevent default
  const submitName = (event) => {
    event.preventDefault();
    if (!firstName || !lastName) {
      alert('We need a first and last name to add you to the list!');
    }
    addNewGuest((firstName, lastName, isAttending)).catch(() => {});
    setFirstName('');
    setLastName('');
    setIsAttending(false);
  };
  // DELETE GUEST BUTTON
  const deleteGuest = async (guest) => {
    const response = await fetch(`${baseUrl}/${guest}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
  };
  // delete all guests button
  const deleteAllGuests = async () => {
    for (let i = 0; i < guestList.length; i++) {
      const currentGuestId = guestList[i].id;
      const response = await fetch(`${baseUrl}/${currentGuestId}`, {
        method: 'DELETE',
      });
      response.status === 200
        ? setGuestList([])
        : alert('Clearing guest list failed!');
    }
  };
  //
  // loading function while fetching
  // {isLoading ? "Loading..." : ""} maybe inside a div?
  //
  return (
    <div className="App">
      <header className="App-header">
        <h1>Be My Guest, Be My Guest</h1>
        {isLoading ? 'Loading...' : ''}
      </header>
      <main>
        <form onSubmit={submitName}>
          <label>
            First Name
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Last Name
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
          <button>Add guest</button>
        </form>
        <div className="showGuests" data-test-id="guest">
          {/* loading function here?*/}
          <ul>
            {guestList.map((guest) => {
              return (
                <div key={guest.id}>
                  <li>
                    {guest.firstName} {guest.lastName}
                    <input type="checkbox" checked={guest.isAttending} />
                    <button onClick={deleteGuest}>Delete guest</button>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
        <div>
          <button onClick={() => deleteAllGuests()}>Delete all guests</button>
        </div>
      </main>
    </div>
  );
}

export default App;
