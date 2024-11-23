import { useState } from "react";
import { fetchMeetingInstances } from "../services/zoomService";

const MeetingsList = ({ meetings }) => {
  const [meetingInstances, setMeetingInstances] = useState('');

  const handleInstances = async (id) => {
    try {
      const response = await fetchMeetingInstances(id);
      console.log(response);
      setMeetingInstances(response.meetings)
    } catch (error) {
      console.log("Error in fetching meeting instances: ", error)
      throw Error("Error in getting Meeting instances: ", error)
    }
  }
    return (
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <h2>{meeting.topic}</h2>
            <p>{new Date(meeting.start_time).toLocaleString()}</p>
            <button onClick={() => handleInstances(meeting.id)}>Get Instances</button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default MeetingsList;
  