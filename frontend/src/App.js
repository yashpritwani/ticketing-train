import React from "react";
import "./App.css";
import Table from "./components/trains";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventDetailsPage from "./components/trainDetails";
import Register from "./components/Register/Register";
import BookedTicket from "./components/bookedTicket/bookedTicket";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/trains" element={<Table />} />
        <Route exact path="/bookedTicket" element={<BookedTicket />} />
        <Route path="/train/:id" element={<EventDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
