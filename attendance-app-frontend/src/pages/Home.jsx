import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="text-center p-6 max-w-md w-full bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white">Welcome to Our Platform</h1>
        <p className="mt-2 text-gray-300">
          Please register or log in...!
        </p>
        <div className="mt-6 flex flex-col space-y-4">
          <button
            onClick={() => navigate("/register")}
            className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Register
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
