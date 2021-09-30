import { useEffect, useState } from 'react';
import axios from 'axios';

import GigForm from './GigForm';
import UpdateForm from './UpdateForm'
import moment from 'moment';

export default function Gigs(props) {
  const [gigs, setGigs] = useState([])
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getGigs();
  }, [])

  // API req for ALL GIGS
  const getGigs = () => {
    axios({
      method: 'get',
      url: 'https://dorados-gig-tracker.herokuapp.com/api/v1/gigs'
    })
      .then(res => {
        const resCopy = [...res.data.data.gigs];
        resCopy.map((gig) => {
          gig.time = moment(gig.time).format('MMMM DD, YYYY h:mm A');
          return gig;
        })
        resCopy.sort((a, b) => {
          return new Date(a.time) - new Date(b.time)
        })
        resCopy.showAll = false;
        resCopy.update = false;
        resCopy.confirmDelete = false;
        setGigs(resCopy);
      })
      .catch(err => {
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
    axios({
      method: 'delete',
      url: `https://dorados-gig-tracker.herokuapp.com/api/v1/gigs/${id}`,
      headers: {
        Authorization: 'Bearer ' + props.user.token
      }
    })
      .then(res => {
        getGigs();
      })
      .catch(err => {
        alert("sorry, was not able to delete the gig", err)
      })
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
        {
          gigs.map(gig => {
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
                      <p>Description: {gig.descrption}</p>
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
              </div>
            )
          })
        }
      </div>
    </div>
  )
}