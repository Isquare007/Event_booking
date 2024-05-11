import React from "react";
import "./BookingItem.css";

const bookingItem = (props) => (
      <li key={props.bookingId} className="booking-list-item">
        <div className="booking-item">
        <h1> {props.title}</h1>
        <h2>{new Date(props.date).toLocaleDateString()}</h2>
        </div>
        <div className="bttn">
            <button className="btn" onClick={() => props.onDelete(props.bookingId)}>
                Cancel
            </button>
        </div>
      </li>
);

export default bookingItem