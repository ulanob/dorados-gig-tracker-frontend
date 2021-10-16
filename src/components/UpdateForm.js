import { useState } from 'react';
import axios from 'axios';

import handleChange from './../utils/handleChange';

export default function GigForm(props) {
  const [reqData, setReqData] = useState({
    musicians: [...props.gig.musicians],
    public: props.gig.public,
  });
  const [loading, setLoading] = useState(false);

  const bandArr = ["Angel", "Boris", "Mark", "Jeremy", "Matt", "MikeViolin", "MikeTrumpet", "Nathan", "Pat", "Paul", "Ray", "Roberto"];
  const suits = ["black", "red", "brown", "grey", "canada"];

  const updateGig = (e, reqType, id) => {
    e.preventDefault();
    setLoading(true);

    axios({
      method: reqType,
      url: 'https://dorados-gig-tracker.herokuapp.com/api/v1/gigs/' + id,
      data: reqData,
      headers: {
        Authorization: 'Bearer ' + props.user.token
      }
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
    <div className="createGig">
      <h2>Update Gig</h2>
      <form action="submit" id="createGig">

        {/* Gig Title */}
        <label htmlFor="title">title (more than 4 characters): </label>
        <input name="title" type="text" id="title" defaultValue={props.gig.title} onChange={(e) => handleChange(e, reqData, setReqData)} />

        {/* Gig venue */}
        <label htmlFor="venue">venue: </label>
        <input name="venue" type="text" id="venue" defaultValue={props.gig.venue} onChange={(e) => handleChange(e, reqData, setReqData)} />

        {/* Venue Address */}
        <label htmlFor="venueAddress">Venue Address: </label>
        <input name="venueAddress" type="text" id="venueAddress" defaultValue={props.gig.venueAddress} onChange={(e) => handleChange(e, reqData, setReqData)} />

        {/* Gig start time */}
        <div>

          <label htmlFor="date">Date: </label>
          <input name="date" type="date" onChange={(e) => getTime(e)} />
        </div>
        <div>

          <label htmlFor="hour">Hour: </label>
          <input name="hour" id="hour" type="time" onChange={(e) => getTime(e)} />
        </div>

        {/* Gig Duration */}
        <div>
          <label htmlFor="gigDuration">Gig Duration: </label>
          <select
            name="gigDuration"
            id="gigDuration"
            form="createGig"
            defaultValue={props.gig.gigDuration}
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
                <div key={i} className='musicianCheck'>
                  <input type="checkbox" id={musician} name={musician}
                    defaultChecked={props.gig.musicians.includes(musician) ? 'checked' : null}
                    onChange={handleFormMusicians} />
                  <label htmlFor={musician} >{musician} </label>
                </div>
              )
            })
          }
        </fieldset>

        <div>
          <label htmlFor="public">public: </label>
          <input name="public" type="checkbox" id="public" defaultChecked={props.gig.public ? 'checked' : null} onChange={(e) => handleFormCheckbox(e.target.id)} />
        </div>

        <div>
          <label htmlFor="restaurant">restaurant gig? </label>
          <input name="restaurant" type="checkbox" id="restaurant" defaultChecked={props.gig.restaurant ? 'checked' : null} onChange={(e) => handleFormCheckbox(e.target.id)} />
        </div>

        <div>
          <label htmlFor="description">description: </label>
          <input name="description" type="text" id="description" defaultValue={props.gig.description} onChange={(e) => handleChange(e, reqData, setReqData)} />
        </div>

        <fieldset
          className="chooseSuit"
          onChange={(e) => handleChange(e, reqData, setReqData)}>
          <legend>Choose suit </legend>
          {
            suits.map((suit, i) => {
              return (
                <div>
                  {
                    suit === props.gig.suit ?
                      <input key={suit + i} name="suit" type="radio" id={suit} value={suit} defaultChecked /> :
                      <input key={suit + i} name="suit" type="radio" id={suit} value={suit} />
                  }
                  <label htmlFor={suit}> {suit}</label>
                </div>
              )
            })
          }
        </fieldset>

        <label htmlFor="notes">notes: </label>
        <input name="notes" type="text" id="notes" defaultValue={props.gig.notes} onChange={(e) => handleChange(e, reqData, setReqData)} />

        <button onClick={(e) => { e.preventDefault(); props.toggleUpdate(e, props.gig) }}>Close</button>
        <button type='submit' onClick={(e) => updateGig(e, 'patch', props.gig.id)}>Update Gig</button>
      </form>
      {
        loading ? <div className="loader"><div className="lds-ripple"><div></div><div></div></div></div> : null
      }
    </div>
  )
}