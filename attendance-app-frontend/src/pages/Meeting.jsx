import React, { useEffect, useState } from "react";
import { fetchMeetings } from "../services/zoomService";
import Loading from "../components/Loading";
import MeetingsList from "../components/MeetingList";
import { RiArrowDownWideLine, RiArrowUpWideLine } from "@remixicon/react";

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const getMeetings = async () => {
    try {
      const response = await fetchMeetings();
      setMeetings(response.meetings);
    } catch (error) {
      throw Error("Error in getting meeting instances: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeetings();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Meetings</h2>
      <div className="space-y-6">
        {/* Meeting List */}
        <section className="bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Meeting List</h2>
              <p className="text-gray-300">
                Display a list of all meetings here.
              </p>
            </div>
            <button
              className="bg-gray-700 p-2 rounded-full"
              onClick={() => setShow((prev) => !show)}
            >
              {show === false ? <RiArrowDownWideLine /> : <RiArrowUpWideLine />}
            </button>
          </div>
        </section>
        {show &&
          (meetings.length === 0 ? (
            <p>No meetings available</p>
          ) : (
            <MeetingsList meetings={meetings} />
          ))}

        {/* Meeting Instances */}
        <section className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Meeting Instances</h3>
          <p className="text-gray-300">
            List instances of a selected meeting (e.g., recurring sessions).
          </p>
          {/* Placeholder for the meeting instances */}
          <div className="mt-4">[Meeting Instances Placeholder]</div>
        </section>

        {/* Participants List */}
        <section className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Participants List</h3>
          <p className="text-gray-300">
            Display a list of participants in a meeting.
          </p>
          {/* Placeholder for the participants list */}
          <div className="mt-4">[Participants List Placeholder]</div>
        </section>

        {/* Meeting Registrants List */}
        <section className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Meeting Registrants</h3>
          <p className="text-gray-300">
            Display a list of registrants for the selected meeting.
          </p>
          {/* Placeholder for the registrants list */}
          <div className="mt-4">[Registrants List Placeholder]</div>
        </section>
      </div>
    </div>
  );
};

export default Meeting;
