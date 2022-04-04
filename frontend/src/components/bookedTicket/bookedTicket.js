import React, { useEffect, useState } from "react";
import "../trains.css";
import {useNavigate} from "react-router-dom";
import { useLocation} from "react-router-dom";

function BookedTicket() {
  const navigate = useNavigate();
  var [bookings, setBookings] = useState([]);
  const { state } = useLocation();
  // var [user, setUser] = useState();
  // user = userR
  useEffect(() => {
    setBookings(state)
  })
  return (
    <>
      {/* {user ? ( */}
        <div >
      <div className="plaintext">
        <p>Hye  !!! Watch all your booked tickets</p>
      <button className="bookedTicket" onClick={()=>navigate('/')}>Back to home</button>
        </div>
      <div className="header">List of bookings</div>
      <div className="table">
        <table className="content-table">
          <thead>
            <tr>
              <td>Booking ID</td>
              <td>Train Name</td>
              <td>Booking Date</td>
              <td>Booked Seat</td>
            </tr>
          </thead>

          {bookings.length &&
            bookings.map((data) => (
              data.index !== "index" ? (
                  <tr>
                <td key={data._id}>{data.bookingDetails._id}</td>
                <td id="status" key={data.trainDetails.name}>{data.trainDetails.name}</td>
                <td key={data.id} id="details">{data.bookingDetails.date}</td>
                <td className="linked" key={data._id} id="details" >{data.bookingDetails.seat}</td>
                </tr>
                ) : (<div></div>)
            ))}
        </table>
      </div>
      </div>
      {/* ):(<p></p>)} */}
    </>
  );
}

export default BookedTicket;
