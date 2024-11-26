import * as zoomService from "../services/zoomService.js";
import Token from "../models/tokenModel.js";

// Zoom OAuth Authorization
export const zoomAuth = (req, res) => {
  try {
    const authUrl = zoomService.getAuthUrl();
    console.log("authURL: ", authUrl)
    return res.redirect(encodeURI(authUrl));
  } catch (error) {
    console.error("Error during authorization", error);
    return res.status(500).json({ error: "Failed to initiate authorization" });
  }
};

// Handle Zoom OAuth redirect
export const zoomRedirect = async (req, res) => {
  try {
    const { code } = req.query;
    const tokenData = await zoomService.getTokensFromCode(code);
    console.log("code: ", code)

    const token = await Token.findOne();
    
    if(token){// Save tokens to the database, and redirect to the frontend
    await Token.updateOne({_id: token._id}, {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
    });
    console.log("Token updated successfully");
    
  }else{
    const newToken = new Token({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000)
    })
    await newToken.save();
    console.log("New token created successfully")
    res.redirect(encodeURI(`${process.env.FRONTEND_URL}/dashboard`));
  }} catch (error) {
    console.error("Error during redirect:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Endpoint to get the token
export const getToken = async (req, res) => {
  try {
    // Fetch the latest token from the database
    const token = await Token.findOne().sort({ expiresAt: -1 }).limit(1);  // Get the most recent token

    if (!token) {
      return res.status(404).json({ error: 'No token found' });
    }

    // Send the token to the frontend
    res.json({ accessToken: token.access_token, expiresAt: token.expires_at });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Meetings
export const getMeetings = async (req, res) => {
  try {
    const accessToken = await zoomService.getValidAccessToken();
    const meetings = await zoomService.getMeetings(accessToken);
    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings: ", error);
    res.status(500).send("Internal Server Error");
  }
};

//Get Instatnces of a Meeting
export const fetchMeetingInstances = async (req, res) => {
  try {
    const meetingId = req.params.id;
    console.log(meetingId)
    const accessToken = await zoomService.getValidAccessToken();
    const meetings = await zoomService.fetchMeetingInstances(accessToken, meetingId);
    
    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings: ", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get Participants
export const getParticipants = async (req, res) => {
  try {
    const accessToken = await zoomService.getValidAccessToken();
    const participantsList = await zoomService.getParticipants(accessToken, req.query.meetingId);
    res.json(participantsList);
  } catch (error) {
    console.error("Error fetching participants: ", error);
    res.status(500).send("Internal Server Error");
  }
};
