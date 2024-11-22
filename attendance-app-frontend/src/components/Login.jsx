import React from "react";

const Login = () => {
  const handleAuth = () => {
    window.location.href = "http://localhost:4000/api/zoom/zoomauth";
  };

  return (
    <div>
      <h1>Login to Zoom</h1>
      <button onClick={handleAuth}>Authenticate with Zoom</button>
    </div>
  );
};

export default Login;
