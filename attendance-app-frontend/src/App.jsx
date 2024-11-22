import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ErrorPage from "./components/ErrorPage";

function App() {
  const [authStatus, setAuthStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  // add logic to get meeting, get token data from backend to frontend.
  // more components to be add.

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
        <Route path="/" element={authStatus ? <Dashboard /> : <Login />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/dashboard" element={authStatus ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
