import { useState } from 'react';
import Nav from './components/Nav'
import Login from './components/Login'
import Gigs from './components/Gigs';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  // const appUrl = process.env.PUBLIC_URL || 'http://localhost:3000/';

  return (
    <div className="app">
      <header>
        <Nav />
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
