/** @jsxImportSource @emotion/react */
import './App.css';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

// CSS-in-JS
const bodyStyles = css`
  width: 100vw;
  height: 100vh;
  background: rgb(208, 208, 208);
  background: linear-gradient(
    180deg,
    rgba(208, 208, 208, 1) 0%,
    rgba(255, 250, 154, 1) 50%,
    rgba(154, 180, 255, 1) 100%
  );
  /* background-color: lightgrey; */
`;
const headerStyles = css`
  margin-top: -25px;
  margin-bottom: 30px;
  color: lightyellow;
  background-color: #2b2b2b;
`;
const inputForm = css`
  font-size: 20px;
  display: flex;
  text-align: center;
  justify-content: center;
  height: 50px;
  .inputNames {
    display: flex;
    text-align: center;
    justify-content: space-around;

    .inputFirstName {
      display: flex;
      flex-direction: column;
      width: 200px;
      label {
        font-weight: 700;
        margin-bottom: 5px;
      }
      input {
        border-radius: 5px;
      }
    }
    .inputLastName {
      display: flex;
      flex-direction: column;
      width: 200px;
      margin-left: 20px;
      label {
        font-weight: 700;
        margin-bottom: 5px;
      }
      input {
        border-radius: 5px;
      }
    }
  }
  button {
    font-weight: 700;
    align-items: center;
    background-color: lightyellow;
    border-color: grey;
    height: 100%;
    border-radius: 15px;
    margin-left: 20px;
  }
`;
const showGuests = css`
  font-weight: 500;
`;
const guestStyles = css`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: space-around;
  width: 35%;
  height: 100px;
  margin: 0 auto 10px;
  border: 2px grey dashed;
  border-radius: 15px;
  li {
    font-weight: 700;
    font-size: 20px;
    justify-content: space-around;
    text-align: center;
    list-style: none;
    .guest-names {
      margin: 5px;
      padding: 5px;
    }
  }
  input {
    margin-left: 15px;
  }
  button {
    background-color: #ffcccc;
    border-color: grey;
    height: 30px;
    border-radius: 15px;
  }
`;

// APPLICATION
function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = 'https://react-guest-list-by-pipo.herokuapp.com/guests';

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
      return;
    } else {
      addNewGuest((firstName, lastName, isAttending)).catch(() => {});
      setFirstName('');
      setLastName('');
      setIsAttending(false);
    }
  };

  // CHANGE ATTENDING STATUS
  const changeAttending = async (id, status) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: status }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);

    const newGuestList = [...guestList];
    const findGuest = newGuestList.find((guest) => guest.id === id);
    findGuest.attending = status;
    setGuestList(newGuestList);
    return updatedGuest;
  };

  // DELETE SINGLE GUEST
  const deleteGuest = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guestList.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuestList(newGuestList);
  };

  // DELETE ALL GUESTS
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

  return (
    <div css={bodyStyles} className="App">
      <header css={headerStyles} className="App-header">
        <h1>Be My Guest, Be My Guest</h1>
      </header>
      <main>
        <form css={inputForm} onSubmit={submitName}>
          <div className="inputNames">
            <div className="inputFirstName">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                disabled={isLoading ? 'disabled' : ''}
              />
            </div>
            <div className="inputLastName">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                disabled={isLoading ? 'disabled' : ''}
              />
            </div>
          </div>
          <button>Add guest</button>
        </form>
        <div className="showGuests" css={showGuests}>
          {isLoading ? (
            'Loading...'
          ) : (
            <ul>
              {guestList.map((guest) => {
                return (
                  <div css={guestStyles} key={guest.id} data-test-id="guest">
                    <li>
                      <div className="guest-names">
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
                        />
                        {guest.attending ? '✅' : '🛑'}{' '}
                      </div>
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
        <div className="deleteAll">
          <button onClick={() => deleteAllGuests()}>Delete all guests</button>
        </div>
      </main>
    </div>
  );
}

export default App;
