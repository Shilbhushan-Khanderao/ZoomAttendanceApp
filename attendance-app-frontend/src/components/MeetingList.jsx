// import { useState } from "react";
// import { fetchMeetingInstances } from "../services/zoomService";

// const MeetingsList = ({ meetings }) => {
//   const [meetingInstances, setMeetingInstances] = useState("");

//   const handleInstances = async (id) => {
//     try {
//       const response = await fetchMeetingInstances(id);
//       console.log(response);
//       setMeetingInstances(response.meetings);
//     } catch (error) {
//       console.log("Error in fetching meeting instances: ", error);
//       throw Error("Error in getting Meeting instances: ", error);
//     }
//   };
//   return (
//     <section>
//       {meetings.map((meeting) => (
//         <div
//           className="bg-gray-800 p-4 m-2 rounded-md flex justify-between items-center"
//           key={meeting.id}
//         >
//           <h3 className="flex-1">{meeting.topic}</h3>
//           <p className="flex-1 text-center">
//             {new Date(meeting.start_time).toLocaleString()}
//           </p>
//           <button
//             className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//             onClick={() => handleInstances(meeting.id)}
//           >
//             Get Instances
//           </button>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default MeetingsList;

import React from "react";

const MeetingList = ({ meetings, onSelectMeeting }) => (
  <ul>
  {meetings.map((meeting) => (
    <li
      key={meeting.id}
      className="flex justify-between items-center m-2 p-2 rounded-md bg-gray-800"
    >
      <span className="text-white font-medium">{meeting.topic}</span>
      <span className="text-white font-medium">{new Date(meeting.start_time).toLocaleString()}</span>
      <button
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        onClick={() => onSelectMeeting(meeting.id)}
      >
        Select
      </button>
    </li>
  ))}
</ul>

);

export default MeetingList;
