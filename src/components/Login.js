import { useState } from 'react';
import axios from 'axios';

import Signup from './Signup'
import handleChange from './../utils/handleChange';

export default function Login(props) {
  const [reqData, setReqData] = useState({});
  const [hasAccount, setHasAccount] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e, obj) => {
    e.preventDefault();
    setLoading(true);

    axios({
      method: 'post',
      url: 'https://dorados-gig-tracker.herokuapp.com/api/v1/users/login',
      data: obj
    })
      .then((res) => {
        props.setUser(res.data);
        window.localStorage.setItem("user", JSON.stringify(res.data));
        props.setLoggedIn(true);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        alert("sorry could not log you in", err)
      })
  }
  return (
    <div className="login">
      {
        hasAccount ?
          <div className="loginForm">
            <h1>Login</h1>

            <form action="submit">

              <label htmlFor="emailInput">Email: </label>
              <input name="emailInput" type="email" id="email" onChange={(e) => handleChange(e, reqData, setReqData)} />

              <label htmlFor="passwordInput">Password: </label>
              <input name="passwordInput" type="password" id="password" onChange={(e) => handleChange(e, reqData, setReqData)} />

              <button type="submit" onClick={(e) => { handleLogin(e, reqData) }}>Login</button>

            </form>

            <button className="signupButton"
              onClick={() => setHasAccount(false)}
            >Don't have an account? Sign Up</button>
          </div> :

          <Signup handleLogin={handleLogin} setReqData={setReqData} />
      }
      {
        loading ? <div className="loader"><div className="lds-ripple"><div></div><div></div></div></div> : null
      }
    </div>
  );

}

