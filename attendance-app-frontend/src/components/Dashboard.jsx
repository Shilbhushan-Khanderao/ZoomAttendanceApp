import { useState, useEffect } from "react";
import MeetingsList from "./MeetingList";
import { fetchMeetings } from "../services/zoomService";
import Loading from "./Loading";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMeetings = async () => {
      try {
        const response = await fetchMeetings();
        console.log(response)
        setMeetings(response.meetings);
      } catch (error) {
        setError("Failed to fetch meetings.");
      } finally {
        setLoading(false);
      }
    };

    getMeetings();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Zoom Meetings</h1>
      {meetings.length === 0 ? (
        <p>No meetings available.</p>
      ) : (
        <MeetingsList meetings={meetings} />
      )}
    </div>
  );
};

export default Dashboard;
