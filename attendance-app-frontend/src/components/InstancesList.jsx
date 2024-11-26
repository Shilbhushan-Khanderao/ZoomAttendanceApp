import React from "react";

const InstancesList = ({ instances, onSelectInstance }) => (
  <ul>
    {instances.map((instance) => (
      <li
        key={instance.uuid}
        className="flex justify-between items-center m-2 p-2 rounded-md bg-gray-800"
      >
        <span className="text-white font-medium">{new Date(instance.start_time).toLocaleString()}</span>

        {/* Action Button */}
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => onSelectInstance(instance.uuid)}
        >
          Select
        </button>
      </li>
    ))}
  </ul>
);

export default InstancesList;
