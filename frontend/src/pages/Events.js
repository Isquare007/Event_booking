import React, { useContext, useEffect, useRef, useState } from "react";
import "./Event.css";
import Modal from "../component/Modal/Modal";
import Backdrop from "../component/Backdrop/Backdrop";
import authContext from "../context/auth-context";
import { Link } from "react-router-dom";
import EventList from "../component/Events/EventList";
import Spinner from "../component/Spinner/Spinner";

function EventsPage() {
  const [isCreate, setIsCreate] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setLoad] = useState(false);
  const [selectedEvents, setSelected] = useState([]);
  const [isActive, setActive] = useState(true);

  const context = useContext(authContext);

  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const dateRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    fetchEvents();

    return () => {
      setActive(false)
    }
  }, []);

  const startCreateEventHandler = () => {
    setIsCreate(true);
  };
  const modalConfirmHandler = () => {
    setIsCreate(false);

    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const desc = descRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      desc.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, desc };
    // console.log(event);

    const requestBody = {
      query: `
        mutation createevent($title: String!, $price: Float!, $date: String!, $desc: String!) {
          createEvent(eventInput: {title: $title, price: $price, date: $date, description: $desc}) {
            _id
            title
            price
            date
            description
          }
        }`,
        variables: {
          title: title,
          price: price,
          date: date,
          desc: desc
        }
    };

    const token = context.token;

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        fetchEvents();
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  const fetchEvents = () => {
    setLoad(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            price
            date
            description
            creator {
              _id
              email
            }
          }
        }`,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        const eventsData = data.data.events;
        if (isActive) {
          setEvents(eventsData);
        setLoad(false);
        }
      })
      .catch((error) => {
        if (isActive) {
          setLoad(false);
        }
        console.error(error);
      });
  };
  const modalCancelHandler = () => {
    setIsCreate(false);
    setSelected([]);
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelected([]);
      return
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvents[0]._id}") {
            _id
            createdAt
          }
        }`,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + context.token
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        const eventsData = data.data.bookEvent;
        setSelected([])
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }
  const showDetailHandler = eventId => {
      const selectedEvents = events.find((e) => e._id === eventId);
      if (selectedEvents) {
        setSelected([selectedEvents])
      }
  }



  return (
    <React.Fragment>
      {(isCreate || selectedEvents.length>0) && <Backdrop />}
      {isCreate && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvents.length > 0 && (
        <Modal
          title={selectedEvents[0].title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? "Book Event" : 'Confirm'}
        >
          <h1>{selectedEvents[0].title}</h1>
          <h2> ${selectedEvents[0].price} - {new Date(selectedEvents[0].date).toLocaleDateString()}</h2>
          <p>{selectedEvents[0].description}</p>
        </Modal>
      )}
      <div className="event-control">
        {!context.token && (
          <React.Fragment>
            <p>Login in to create events</p>
            <Link to="/auth">
              <button className="btn">Login</button>
            </Link>
          </React.Fragment>
        )}

        {context.token && (
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        )}
      </div>
      {isLoading ? (
        <Spinner/>
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
}

export default EventsPage;
