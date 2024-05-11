import React from "react";
import "./BookingList.css"
import BookingItem from "./BookingItem";

const bookingList = (props) => {
    const bookings = props.bookings.map((booking) => {
        return (
            <BookingItem
            key={booking._id}
            bookingId={booking._id}
            title={booking.event.title}
            date={booking.event.date}
            onDelete={props.deleteBooking}
            />
        )
    })
    return <ul className="booking-list"> {bookings} </ul>
}

export default bookingList