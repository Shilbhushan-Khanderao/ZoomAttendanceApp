import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  
  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <main className="p-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-4 text-gray-300">
            This is where you can add widgets, stats, or charts to display relevant data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-semibold">Meetings</h3>
              <p className="mt-2 text-gray-300">Get List of Meetings and populate attendance</p>
              <button className="p-2 bg-green-500 hover:bg-green-700 text-black rounded mt-2"><Link to="/meeting">Visit</Link></button>
            </div>
            <div className="p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-semibold">Attendance</h3>
              <p className="mt-2 text-gray-300">Check attendance of students and view</p>
              <button className="p-2 bg-green-500 hover:bg-green-700 text-black rounded mt-2"><Link to="/attendance">Visit</Link></button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
