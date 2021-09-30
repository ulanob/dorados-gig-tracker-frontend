import { useState } from 'react';
import axios from 'axios';

import handleChange from './../utils/handleChange';

export default function Signup(props) {
  const [reqData, setReqData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'https://dorados-gig-tracker.herokuapp.com/api/v1/users/signup',
      data: reqData
    })
      .then((res) => {
        if (res.status === 201) {
          props.handleLogin(e, reqData);
        }
      })
      .catch((err) => {
        alert("sorry could not sign up", err);
      });
  }

  return (
    <div className="signup wrapper">
      <h2>Sign Up</h2>

      <form action="submit">
        <label htmlFor="name">Name: </label>
        <input name="name" type="text" id="name" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        <label htmlFor="email">Email: </label>
        <input name="email" type="text" id="email" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        <label htmlFor="password">Password: </label>
        <input name="password" type="password" id="password" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        <label htmlFor="passwordConfirm">Confirm Password: </label>
        <input name="passwordConfirm" type="password" id="passwordConfirm" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        <fieldset className="wrapper" onChange={(e) => handleChange(e, reqData, setReqData)} required>
          <legend>Role:</legend>

          <div>
            <input id="general" type="radio" name="roleSelection" value="user" />
            <label htmlFor="user">I'm hiring Los Dorados!</label>
          </div>

          <div>
            <input id="member" type="radio" name="roleSelection" value="member" />
            <label htmlFor="user">I'm a member of Los Dorados.</label>
          </div>

          <div>
            <input id="admin" type="radio" name="roleSelection" value="admin" />
            <label htmlFor="user">Soy El Jefe!</label>
          </div>
        </fieldset>

        <button type="submit" onClick={(e) => handleSubmit(e, 'post', reqData, 'users/signup')}>Sign up</button>
      </form>
    </div>
  );
}
