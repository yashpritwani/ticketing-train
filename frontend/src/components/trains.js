import React, { useEffect, useState } from "react";
import "./trains.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import { useLocation} from "react-router-dom";
import getUrl from "../getUrl";
import swal from 'sweetalert'
function Table() {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const { state } = useLocation();
  var [user, setUser] = useState();
  const [fromStation, setFromStation] = useState();
  const [toStation, setToStation] = useState();
  const [modal, setModal] = useState(false);
  const url = getUrl()
  useEffect(() => {
    setUser(state.user)
    // console.log(trains)
    if(trains.length===0){
      axios
      .get(`${url}/trains`)
      .then((res) => {
        console.log(res)
        setTrains(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  });
  if(!user) navigate('/')
  async function bookTicket(id){
    const res = await fetch(`https://ticketing-train.herokuapp.com/bookTrain`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trainId:id , userId:user._id , bookingdate:Date.now() , bookedSeat: "S" + Math.random() + " " + Math.random() 
      })
  })
  const data = await res.json();
  console.log(data.message)
  if(res.status === 200 || res.status === 201) {
      swal({
          title: "Good job!",
          text: `${data.message}`,
          icon: "success",
          button: "Continue",
      });
      navigate("/trains", {state: data});
  }
  else{
      swal({
          title: "Error Occured",
          text: `${data.message}`,
          icon: "error",
          button: "Continue",
      });
  }
  }
  async function changeTrains(){
    setModal(!modal)
      let resp = await fetch(`https://ticketing-train.herokuapp.com/train/data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fromStation , toStation
        })
    })
    if(resp.status === 200){
      const data = await resp.json()
      console.log(data)
      setTrains(data.reqtrains)
      swal({
        title: "Trains found",
        text: `Trains found for this root`,
        icon: "success",
        button: "Continue",
    });
    }
    else{
      swal({
        title: "Error Occured",
        text: `No trains found for this route`,
        icon: "error",
        button: "Continue",
    });
    navigate('/trains')
    }
  }
  async function bookingHistory(){
    console.log("hello")
    const res = await fetch(`https://ticketing-train.herokuapp.com/bookingHistory`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          userId:user._id
      })
    })
    console.log("hello1")
    console.log(res)
    if(res.status===200){
      console.log(res)
      const data = await res.json()
      console.log(data)
      let bookings = data.bookedTrains;
      navigate('/bookedTicket',{state:bookings},{userR:user})
    }else{
      swal({
        title: "Error Occured",
        text: `Unable to fetch bookings`,
        icon: "error",
        button: "Continue",
    });
    navigate('/trains')
    }
  }
  return (
    <>
            <div className="all__campaigns">
    <div className={modal ? "payment__modal" : "none"}>
                <div className="form">
                    <div className="payment__form">
                        <label htmlFor="Address">Enter from Station: </label>
                        <input
                            type="text"
                            name="fromStation"
                            value={fromStation}
                            onChange={(e)=>setFromStation(e.target.value)}
                            required
                        />
                        <label htmlFor="city">Enter to Station: </label>
                        <input
                            type="text"
                            name="toStation"
                            value={toStation}
                            onChange={(e)=>setToStation(e.target.value)}
                            required
                        />
                        <button onClick={()=>changeTrains()}>Find Train</button>
                    </div>
                </div>
            </div>
            </div>
      {user ? (
        <div >
      <div className="plaintext">
        <p>Hye {user.userName} !!! Welcome to train ticket booking</p>
      <button className="bookedTicket" onClick={()=>bookingHistory()}>Booked Tickets</button>
        </div>
      <div className="buttons">
        {/* <button className="bookTicket" onClick={()=>navigate('/bookTicket',{state: user})}>Book Ticket</button> */}
        <button className="bookTicket" onClick={()=>setModal(!modal)}>Find And Book Train</button>
        </div>
      <div className="header">List of trains</div>
      <div className="table">
        <table className="content-table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Runnig On</td>
              <td>View Details</td>
              <td>Booking</td>
            </tr>
          </thead>

          {trains.length &&
            trains.map((data) => (
              data.index !== "index" ? (
                  <tr>
                <td key={data._id}>{data.name}</td>
                <td id="status" key={data._id}>
                {data.weekDays.map(weekDay => (
                  <span className="weekDay">{weekDay}</span>
                  ))}
                </td>
                  <td key={data.id} id="details" onClick={()=>navigate(`/train/${data._id}`,{state:data})}>
                    View Train Details
                  </td>
                  <td className="linked" key={data._id} id="details" onClick={()=>bookTicket(data._id)}>
                    Book Ticket
                  </td>
                </tr>
                ) : (<div></div>)
            ))}
        </table>
      </div>
      </div>
      ):(<p></p>)}
    </>
  );
}

export default Table;
