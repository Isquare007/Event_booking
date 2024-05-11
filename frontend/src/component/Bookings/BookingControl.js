import React from "react";
import "./BookingControl.css";

const bookingControl = (props) => {
  return (
    <div className="booking-control">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={() => props.corouselChanger("list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={() => props.corouselChanger("chart")}
      >
        Chart
      </button>
    </div>
  );
};


export default bookingControl;
