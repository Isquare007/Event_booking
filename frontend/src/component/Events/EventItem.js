import React from "react";
import "./EventItem.css";

const eventItem = (props) => (
  <li key={props.eventId} className="event-list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      <button className="btn" onClick={() => props.onDetail(props.eventId)}>
        View Details
      </button>
    </div>
    {props.userId === props.creatorId && <div className="circle"></div>}
  </li>
);

export default eventItem;
