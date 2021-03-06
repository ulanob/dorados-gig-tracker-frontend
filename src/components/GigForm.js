import { useState } from 'react';
import axios from 'axios';

import handleChange from './../utils/handleChange';

export default function GigForm(props) {
  const [reqData, setReqData] = useState({
    musicians: [],
    public: false,
    date: '',
    hour: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);

  const bandArr = ["Alex", "Angel", "Boris", "Mark", "Jeremy", "Julian", "Matt", "MikeViolin", "MikeTrumpet", "Nathan", "Pat", "Paul", "Ray", "Roberto"];
  const endpoint = 'https://dorados-gig-tracker.herokuapp.com/api/v1/gigs'

  const createGig = (e) => {
    e.preventDefault();
    setLoading(true)
    axios({
      method: 'post',
      url: endpoint,
      data: reqData
    })
      .then(() => {
        setLoading(false);
        props.getGigs();
      })
      .catch(err => {
        setLoading(false);
        alert(`Error: ${err}`)
      })
  }

  const handleFormMusicians = (e) => {
    const reqCopy = { ...reqData };
    const musician = e.target.id;
    if (reqCopy.musicians.includes(musician)) {
      reqCopy.musicians = reqCopy['musicians'].filter(player => player !== musician);
    } else {
      reqCopy.musicians.push(musician);
    }
    setReqData(reqCopy);
  }

  const handleFormCheckbox = (param) => {
    const reqCopy = { ...reqData };
    reqCopy[param] = !reqCopy[param];

    setReqData(reqCopy);
  }

  const getTime = (e) => {
    const reqCopy = { ...reqData };
    if (e.target.name === "date") {
      reqCopy.date = e.target.value
    } else if (e.target.name === "hour") {
      reqCopy.hour = e.target.value
    }
    reqCopy.time = reqCopy.date + " " + reqCopy.hour;

    setReqData(reqCopy);
  }

  return (
    <div className="createGig wrapper">
      <h2>New Gig</h2>
      <form action="submit" id="createGig">

        {/* Gig Title */}
        <label htmlFor="title">title (more than 4 characters, required): </label>
        <input name="title" type="text" id="title" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        {/* Gig venue */}
        <label htmlFor="venue">venue: </label>
        <input name="venue" type="text" id="venue" onChange={(e) => handleChange(e, reqData, setReqData)} />

        {/* Venue Address */}
        <label htmlFor="venueAddress">Venue Address (required): </label>
        <input name="venueAddress" type="text" id="venueAddress" onChange={(e) => handleChange(e, reqData, setReqData)} required />

        {/* Gig start time */}
        <div>
          <label htmlFor="date">Date (required): </label>
          <input name="date" type="date" onChange={(e) => getTime(e)} required />
        </div>

        <div>
          <label htmlFor="hour">Hour (required): </label>
          <input name="hour" id="hour" type="time" onInput={(e) => getTime(e)} required />
        </div>

        {/* Gig Duration */}
        <div>
          <label htmlFor="gigDuration">Gig Duration: </label>
          <select
            name="gigDuration"
            id="gigDuration"
            form="createGig"
            onChange={(e) => handleChange(e, reqData, setReqData)}>
            <option value="" defaultValue>Provide Gig Length</option>
            <option value="0.5">30mins</option>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
          </select>
        </div>


        <fieldset className="chooseMusicians">
          <legend>Choose musicians</legend>
          {
            bandArr.map((musician, i) => {
              return (
                <div key={"musician" + i} className='musicianCheck'>
                  <input type="checkbox" id={musician} name={musician} onChange={handleFormMusicians} />
                  <label htmlFor={musician} >{musician} </label>
                </div>
              )
            })
          }
        </fieldset>

        <div>
          <label htmlFor="public">public: </label>
          <input
            name="public"
            type="checkbox"
            id="public"
            onChange={(e) => handleFormCheckbox(e.target.id)} />
        </div>

        <div>
          <label htmlFor="restaurant">restaurant gig? </label>
          {/* checkbox: boolean */}
          <input
            name="restaurant"
            type="checkbox"
            id="restaurant"
            onChange={(e) => handleFormCheckbox(e.target.id)} />
        </div>

        <label htmlFor="description">description: </label>
        <input name="description" type="text" id="description" onChange={(e) => handleChange(e, reqData, setReqData)} />

        <fieldset
          className="chooseSuit"
          onChange={(e) => handleChange(e, reqData, setReqData)}>
          <legend>Choose suit </legend>

          <div>
            <input name="suit" type="radio" id="black" value="black" />
            <label htmlFor="black">Black</label>
          </div>

          <div>
            <input name="suit" type="radio" id="red" value="red" />
            <label htmlFor="red">Red</label>
          </div>

          <div>
            <input name="suit" type="radio" id="brown" value="brown" />
            <label htmlFor="brown">Brown</label>
          </div>

          <div>
            <input name="suit" type="radio" id="grey" value="grey" />
            <label htmlFor="grey">Grey</label>
          </div>

          <div>
            <input name="suit" type="radio" id="canada" value="canada" />
            <label htmlFor="canada">Canada White</label>
          </div>

        </fieldset>

        <label htmlFor="notes">notes: </label>
        <input name="notes" type="text" id="notes" onChange={(e) => handleChange(e, reqData, setReqData)} />

        <button type="reset">Reset Form</button>
        <button type='submit' onClick={(e) => createGig(e)}>Create Gig</button>
      </form>
      {
        loading ? <div className="loader"><div className="lds-ripple"><div></div><div></div></div></div> : null
      }
    </div>
  )
}