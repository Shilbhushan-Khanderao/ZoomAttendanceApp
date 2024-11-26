import { useState, useEffect } from "react";
import MeetingsList from "./MeetingList";
import { fetchMeetingInstances, fetchMeetings } from "../services/zoomService";
import Loading from "./Loading";
import MeetingList from "./MeetingList";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const getMeetings = async () => {
    try {
      const response = await fetchMeetings();
      console.log(response);
      setMeetings(response.meetings);
    } catch (error) {
      setError("Failed to fetch meetings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMeeting = async (meetingId) =>{
    setLoading(true)
    setSelectedMeeting(meetingId)
    try {
      const response = await fetchMeetingInstances(meetingId)
      setInstances(response.meetings)
    } catch (error) {
      setError("Failed to fetch meeting instances.")
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getMeetings();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Zoom Meetings Dashboard</h1>

      {/* Meetings List */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Meetings</h2>
        {meetings.length === 0 ? (
          <p>No meetings available.</p>
        ) : (
          <MeetingList
            meetings={meetings}
            onSelectMeeting={handleSelectMeeting}
          />
        )}
      </section>

      {/* Meeting Instances */}
      {selectedMeeting && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold">Meeting Instances</h2>
          {instances.length === 0 ? (
            <p>No instances available for this meeting.</p>
          ) : (
            <InstancesList
              instances={instances}
              onSelectInstance={handleSelectInstance}
            />
          )}
        </section>
      )}

      {/* Attendance Dashboard */}
      {attendance.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold">Attendance Dashboard</h2>
          <AttendanceDashboard attendance={attendance} />
        </section>
      )}
    </div>
  );
};

export default Dashboard;
