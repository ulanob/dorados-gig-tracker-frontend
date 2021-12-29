import { useEffect, useState } from 'react';
import axios from 'axios';

import GigForm from './GigForm';
import UpdateForm from './UpdateForm'
import moment from 'moment';

export default function Gigs(props) {
  const [gigs, setGigs] = useState([])
  const [display, setDisplay] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    getGigs();
    setCurrentMonth(moment(Date()).format('YYYY MM'));
  }, [])

  useEffect(() => {
    setDisplay(gigs.filter(gig => gig.month === currentMonth));
  }, [gigs, currentMonth])

  // API req for ALL GIGS
  const getGigs = () => {
    setLoading(true);
    axios({
      method: 'get',
      url: 'https://dorados-gig-tracker.herokuapp.com/api/v1/gigs'
    })
      .then(res => {
        setLoading(false);
        const resCopy = [...res.data.data.gigs];
        // const filtered = resCopy.filter((gig) => {
        //   return gig.musicians.includes(props.user.data.user.name)
        // })
        // console.log(filtered);
        const current = [];
        resCopy.map((gig) => {
          gig.time = moment(gig.time).format('MMMM DD, YYYY h:mm A');
          gig.month = moment(gig.time).format('YYYY MM')
          if (!current.includes(gig.month)) {
            current.push(gig.month);
          }
          return gig;
        })
        resCopy.sort((a, b) => {
          return new Date(a.time) - new Date(b.time)
        })
        resCopy.showAll = false;
        resCopy.update = false;
        resCopy.confirmDelete = false;
        setMonths(current);
        setShowForm(false);
        setGigs(resCopy);
        setDisplay(gigs);
      })
      .catch(err => {
        setLoading(false);
        alert('sorry, was not able to get the gigs', err);
      })
  }

  const toggleForm = () => {
    let isToggled = showForm;
    isToggled = !isToggled;
    setShowForm(isToggled);
  }

  const toggleUpdate = (e, thisGig) => {
    e.preventDefault();
    const gigsCopy = [...gigs];
    const setStatus = gigsCopy.map(gig => {
      if (gig.id === thisGig.id) {
        gig.updateStatus = !gig.updateStatus;
        return gig
      } else return gig
    })
    setGigs(setStatus);
  }
  const toggleConfirmDelete = (e, thisGig) => {
    e.preventDefault();
    const gigsCopy = [...gigs];
    const setStatus = gigsCopy.map(gig => {
      if (gig.id === thisGig.id) {
        gig.confirmDelete = !gig.confirmDelete;
        return gig
      } else return gig
    })
    setGigs(setStatus);
  }
  const toggleShowAll = (e, thisGig) => {
    e.preventDefault();
    const gigsCopy = [...gigs];
    const setStatus = gigsCopy.map(gig => {
      if (gig.id === thisGig.id) {
        gig.showAll = !gig.showAll;
        return gig
      } else return gig
    })
    setGigs(setStatus);
  }

  const deleteGig = (e, id) => {
    e.preventDefault();
    setLoading(true);
    axios({
      method: 'delete',
      url: `https://dorados-gig-tracker.herokuapp.com/api/v1/gigs/${id}`,
      headers: {
        Authorization: 'Bearer ' + props.user.token
      }
    })
      .then(() => {
        setLoading(false);
        getGigs();
      })
      .catch(err => {
        setLoading(false);
        alert("sorry, was not able to delete the gig", err)
      })
  }

  const setDateSelect = (id, val) => {
    let element = document.getElementById(id);
    element.value = val;
  }

  return (
    <div className="wrapper">
      {
        props.user.data.user.role === 'admin' ?
          <button
            onClick={toggleForm}
            className="createGigButton"
          >Create a new Gig</button> : null
      }
      {
        props.user.data.user.role === 'admin' &&
          showForm ?
          <div>
            <GigForm
              getGigs={getGigs}
              gigs={gigs}
              user={props.user}
            />
            <button onClick={toggleForm}>Hide Form</button>
          </div> : null
      }
      <h3>Here are the gigs, {props.user.data.user.name}:</h3>
      <div className="gigContainer">
        <form action="submit" onChange={(e) => setCurrentMonth(e.target.value)}>
          <label htmlFor="selectMonth">Select Month:</label>
          <select name="selectMonth" id="selectMonth">
            {
              months.map(month => {
                return (
                  <option selected={month === currentMonth ? "selected" : null}>{month}</option>
                )
              })
            }
          </select>
        </form>
        {
          display.length > 0 ? display.map(gig => {
            return (
              <div className="gig" key={gig.id}>
                <h4>{gig.time}: {gig.title}</h4>
                <p>Address: {gig.venueAddress}</p>
                <p>Duration: {gig.duration}</p>
                <p>Musicians: {gig.musicians.map((musician) => {
                  return (<span key={musician}>{musician} </span>)
                })}</p>
                <p>Public/private: {gig.public ? 'public gig' : 'private'}</p>
                <p>Duration: {gig.durationMinutes} min</p>

                <button onClick={(e) => toggleShowAll(e, gig)}>More info</button>
                {
                  gig.showAll ?
                    <div>
                      <p>Description: {gig.description}</p>
                      <p>Suit: {gig.suit}</p>
                      <p>Restaurant?: {gig.restaurant ? 'Restaurant Gig' : 'Not a restaurant gig'}</p>
                      <p>Notes: {gig.notes}</p>
                    </div> : null
                }

                {
                  props.user.data.user.role === 'admin' ?
                    <div>
                      <button onClick={(e) => toggleUpdate(e, gig)}>Update</button>
                      <button onClick={(e) => { toggleConfirmDelete(e, gig) }}>Delete</button>
                    </div> : null
                }
                {
                  gig.updateStatus ?
                    <UpdateForm
                      gigs={gigs}
                      getGigs={getGigs}
                      gig={gig}
                      toggleUpdate={toggleUpdate}
                      user={props.user} /> : null
                }
                {
                  gig.confirmDelete ?
                    <div>
                      <p>Are you sure you want to Delete?</p>
                      <button onClick={(e) => deleteGig(e, gig.id)}>Delete</button>
                      <button onClick={(e) => toggleConfirmDelete(e, gig)}>Cancel</button>
                    </div>
                    : null
                }
                {
                  loading ? <div className="loader"><div className="lds-ripple"><div></div><div></div></div></div> : null
                }
              </div>
            )
          }) : <p>No gigs yet! Add a new gig with the button above</p>}
      </div>
    </div >
  )
}