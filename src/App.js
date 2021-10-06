import { useState, useEffect } from 'react';
import Nav from './components/Nav'
import Login from './components/Login'
import Gigs from './components/Gigs';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      // const foundUser = JSON.parse(loggedInUser);
      setUser(JSON.parse(loggedInUser));
      setLoggedIn(true);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("user");
    setLoggedIn(false);
    setUser({})
  }

  // const appUrl = process.env.PUBLIC_URL || 'http://localhost:3000/';

  return (
    <div className="app">
      <header>
        <Nav />
        {
          loggedIn ?
            <div className='buttonContainer'>
              <button onClick={() => logout()}>Logout</button>
            </div> : null
        }
      </header>
      <main>
        {
          loggedIn ?
            <div>
              <Gigs user={user} />
            </div> :
            <Login setLoggedIn={setLoggedIn} setUser={setUser} />
        }


      </main>
      <footer>Created by <a href="http://borisweb.dev">Boris</a> for Mariachi Los Dorados</footer>
    </div>
  );
}
