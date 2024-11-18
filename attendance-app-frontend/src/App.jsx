import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [authResponse, setAuthResponse] = useState(null);
  const handleAuth = () => {
    window.location.href = "http://localhost:4000/api/zoom/zoomauth";
  };
  return (
    <>
      <div>
        <h1>App Component</h1>
        <button onClick={handleAuth}>Get Zoom Auth</button>
      </div>
    </>
  );
}

export default App;
