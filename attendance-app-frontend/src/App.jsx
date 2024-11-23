import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Meeting from "./pages/Meeting";
import Attendance from "./pages/Attendance";

function App() {
  const [authStatus, setAuthStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const fetchToken = async () =>{
    try {
      const response = await axios.get('http://localhost:4000/api/zoom/token');
      console.log("token response from db: ", response)
      if(response.data.accessToken){
        setAccessToken(response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken);
      }
    } catch (error) {
      console.error('Error fetching token: ', error);
    }
  }

  useEffect(() => {
    fetchToken();
    const token = localStorage.getItem("token");
    if (token) {
      setAuthStatus(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meeting" element={<Meeting/>}/>
        <Route path="/attendance" element={<Attendance/>}/>
      </Routes>
    </Router>
  );
}

export default App;
