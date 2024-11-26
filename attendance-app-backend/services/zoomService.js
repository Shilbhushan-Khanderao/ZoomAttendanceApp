import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import Token from "../models/tokenModel.js";

dotenv.config();

// Function to get Zoom OAuth authorization URL
export const getAuthUrl = () => {
  return `https://zoom.us/oauth/authorize?response_type=code&client_id=${
    process.env.ZOOM_CLIENT_ID
  }&redirect_uri=${encodeURI(process.env.ZOOM_OAUTH_REDIRECT_URI)}`;
};

// Function to exchange the authorization code for an access token
export const getTokensFromCode = async (code) => {
  const data = qs.stringify({
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.ZOOM_OAUTH_REDIRECT_URI,
  });

  const config = {
    method: "post",
    url: "https://zoom.us/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64"),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;  // Return the tokens from Zoom
  } catch (error) {
    console.error("Error during token exchange: ", error);
    throw error;
  }
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = async (refreshToken) => {
  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    method: "post",
    url: "https://zoom.us/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64"),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Function to get the list of meetings for a user
export const getMeetings = async (jwt_token) => {
  try {
    const response = await axios.request({
      method: "get",
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings: ", error);
    throw error;
  }
};

// Fetch instances of a past meeting
export const fetchMeetingInstances = async (jwt_token, meetingId) => {
  try {
    const response = await axios.request({
      url: `https://api.zoom.us/v2/past_meetings/${meetingId}/instances`,
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get the participants of a past meeting
export const getParticipants = async (jwt_token, meetingId) => {
  try {
    const response = await axios.request({
      method: "get",
      url: `https://api.zoom.us/v2/meetings/${meetingId}/participants`,
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching participants: ", error);
    throw error;
  }
};

// Function to check if the access token has expired
export const isTokenExpired = (token) => {
  const currentTime = Date.now();
  return currentTime > new Date(token.expires_at).getTime();
};

// Function to get the current valid access token (handles refresh if expired)
export const getValidAccessToken = async () => {
  const token = await Token.findOne();
  if (!token) throw new Error("No token found in DB.");

  if (isTokenExpired(token)) {
    // Token expired, refresh it
    try {
      const refreshedTokenData = await refreshAccessToken(token.refresh_token);
    await Token.updateOne({_id: token._id}, {
      access_token: refreshedTokenData.access_token,
      refresh_token: refreshedTokenData.refresh_token,
      expires_at: new Date(Date.now() + refreshedTokenData.expires_in * 1000),
    });
    console.log("Access token refreshed successfully")
    return refreshedTokenData.access_token;  
  } catch (error) {
     throw new Error("Failed to refresh access token") 
    }
  }
  console.log("Access token is valid")
  return token.access_token;
};
