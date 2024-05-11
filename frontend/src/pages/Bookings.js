import React, { useContext, useEffect, useState } from "react";
import authContext from "../context/auth-context";
import Spinner from "../component/Spinner/Spinner";
import BookingList from "../component/Bookings/BookingList";

import Chart from "../component/Bookings/Chart";
import BookingControl from "../component/Bookings/BookingControl";

function BookingsPage() {
  const [isLoading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutput] = useState("list");

  const context = useContext(authContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }`,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        const bookingsData = data.data.bookings;
        setBookings(bookingsData);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };
  const deleteHandler = (bookingId) => {
    setLoading(true);
    const requestBody = {
      query: `
          mutation cancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId,
      },
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        setBookings((prevState) => {
          const updatedBooking = Array.isArray(prevState)
            ? prevState.filter((booking) => {
                return booking._id !== bookingId;
              })
            : [];
          return updatedBooking;
        });
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  const corousel = (outputType) => {
    if (outputType === "list") {
      setOutput("list");
    } else {
      setOutput("chart");
    }
  };

  let content;
  if (bookings.length == 0 || !context.token) {
    content = <h1>You have no booking</h1>;
  } else {
    content = <Spinner />;
  }

  if (!isLoading) {
    content = (
      <React.Fragment>
        <BookingControl
          corouselChanger={corousel}
          activeOutputType={outputType}
        />

        <div>
          {outputType === "list" ? (
            <BookingList bookings={bookings} deleteBooking={deleteHandler} />
          ) : (
            <Chart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {content}
      {/* {bookings.length == 0 || !context.token ? (
        <h1>You have no booking</h1>
      ) : (
        <div>
          {isLoading ? (
            <Spinner />
          ) : (
            <BookingList bookings={bookings} deleteBooking={deleteHandler} />
          )}
        </div>
      )} */}
    </React.Fragment>
  );
}

export default BookingsPage;
