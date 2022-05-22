import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = 'http://localhost:4000/guests';

  // FETCH DATA FROM BASE URL
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch(baseUrl);
      const data = await response.json();
      setGuestList(data);
      setIsLoading(false);
    }

    fetchData().catch(() => {});
  }, []);

  // ADD NEW GUEST
  const addNewGuest = async () => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        isAttending: false,
      }),
    });
    const addedGuest = await response.json();
    setGuestList([...guestList, addedGuest]);
  };

  // SUBMIT NAMES AND PREVENT DEFAULT
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

  // CHANGE ATTENDING STATUS
  const changeAttending = async (id, status) => {
    const response = await fetch(`${baseUrl}/${guestList.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: guestList.isAttending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);

    const newGuestList = [...guestList];
    const findGuest = newGuestList.find((guest) => guest.id === id);
    findGuest.attending = status;

    console.log(findGuest);

    setGuestList(newGuestList);
    return updatedGuest;
  };

  // DELETE SINGLE GUEST
  const deleteGuest = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    const newGuestList = guestList.filter((guest) => guest.id !== id);
    setGuestList(newGuestList);
  };

  // DELETE ALL GUESTS
  // const deleteAllGuests = async () => {
  //   for (let i = 0; i < guestList.length; i++) {
  //     const currentGuestId = guestList[i].id;
  //     const response = await fetch(`${baseUrl}/${currentGuestId}`, {
  //       method: 'DELETE',
  //     });
  //     response.status === 200
  //       ? setGuestList([])
  //       : alert('Clearing guest list failed!');
  //   }
  // };

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
              disabled={isLoading ? 'disabled' : ''}
            />
          </label>
          <label>
            Last Name
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={isLoading ? 'disabled' : ''}
            />
          </label>
          <button>Add guest</button>
        </form>
        <div className="showGuests" data-test-id="guest">
          {isLoading ? (
            'Loading...'
          ) : (
            <ul>
              {guestList.map((guest) => {
                return (
                  <div key={guest.id}>
                    <li>
                      {guest.firstName} {guest.lastName}
                      <input
                        type="checkbox"
                        aria-label="attending"
                        checked={guest.attending}
                        onChange={(event) => {
                          changeAttending(
                            guest.id,
                            event.currentTarget.checked,
                          ).catch(() => {});
                        }}
                      />{' '}
                      {guest.attending ? '✅' : '🛑'}
                      <button onClick={() => deleteGuest(guest.id)}>
                        Remove
                      </button>
                    </li>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
        {/* <div>
          <button onClick={() => deleteAllGuests()}>Delete all guests</button>
        </div> */}
      </main>
    </div>
  );
}

export default App;
