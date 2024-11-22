import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

let accessToken = "";
let refreshToken = "";

// Helper function for basic auth header
const getAuthHeader = () => {
  return "Basic " + Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64");
};

// URL for OAuth authorization
const authorize = () => {
  return `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${encodeURI(process.env.ZOOM_OAUTH_REDIRECT_URI)}`;
};

// Exchange authorization code for tokens
const redirect = async (code) => {
  const data = qs.stringify({
    code: code,
    grant_type: "authorization_code",
    redirect_uri: process.env.ZOOM_OAUTH_REDIRECT_URI,
  });

  const config = {
    method: "post",
    url: "https://zoom.us/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: getAuthHeader(),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    console.log("Access Token:", accessToken);  ///to be removed
    console.log("Refresh Token:", refreshToken); //to be removed

    return response.data;
  } catch (error) {
    console.error("Error during redirect:", error);
    throw error;
  }
};

// Refresh access token using the refresh token
const refreshAccessToken = async () => {
  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    method: "post",
    url: "https://zoom.us/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: getAuthHeader(),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    console.log("New Access Token:", accessToken);  //to be removed
    console.log("New Refresh Token:", refreshToken); //to be removed

    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Fetch meetings for a user
const meetings = async (jwt_token) => {
  try {
    const response = await axios.request({
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error; // Re-throw the error for caller to handle
  }
};

// Fetch instances of a past meeting
const meetingInstances = async (jwt_token) => {
  try {
    const response = await axios.request({
      url: "https://api.zoom.us/v2/past_meetings/88331915990/instances",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch participants of a past meeting
const participants = async (jwt_token) => {
  const options = {
    method: "GET",
    url: "https://api.zoom.us/v2/past_meetings/88331915990/participants",
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  };

  try {
    const response = await axios.get(options.url, options);
    console.log(response.data); //to be removed
    return response;
  } catch (error) {
    console.error(error);
  }
};

export {
  authorize,
  redirect,
  meetings,
  participants,
  meetingInstances,
  refreshAccessToken,
  accessToken,
};
