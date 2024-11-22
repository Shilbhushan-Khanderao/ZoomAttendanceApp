import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const authorize = () => {
  return `https://zoom.us/oauth/authorize?response_type=code&client_id=${
    process.env.ZOOM_CLIENT_ID
  }&redirect_uri=${encodeURI(process.env.ZOOM_OAUTH_REDIRECT_URI)}`;
};

const redirect = async (code) => {
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
    return response.data;
  } catch (error) {
    console.error("Error during redirect:", error);
    throw error;
  }
};

const refreshAccessToken = async (refreshToken) => {
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
    throw error;
  }
};

const participants = async (jwt_token) => {
  try {
    const response = await axios.request({
      url: "https://api.zoom.us/v2/past_meetings/88331915990/participants",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { authorize, redirect, refreshAccessToken, meetings, participants };
