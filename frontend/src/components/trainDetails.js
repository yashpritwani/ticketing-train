import React from "react";
import { useLocation} from "react-router-dom";
import { useNavigate } from "react-router-dom";
const EventDetails = () => {
  const navigate = useNavigate()
  // var [state, setstate] = useState();
  const { state } = useLocation();
  // useEffect(() => {
    // setstate(state)
  // })
  console.log(state)
  return (
    <>
    <button className="bookedTicket" onClick={()=>navigate('/')}>Back to Home</button>
      <div className="Details">
      <table className="content-table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Runnig On</td>
              <td>Stations</td>
            </tr>
          </thead>
        <tr>
                <td key={state._id}>{state.name}</td>
                <td id="status" key={state._id}>
                {state.weekDays.map(weekDay => (
                  <span className="weekDay">{weekDay}</span>
                  ))}
                </td>
                  <td key={state.id} id="details" >
                  {state.stations.map(station => (
                  <span className="weekDay">{station}</span>
                  ))}
                  </td>
        </tr>
        </table>
      </div>
    </>
  );
};

export default EventDetails;
