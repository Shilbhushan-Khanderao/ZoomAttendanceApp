import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  authorize,
  redirect,
  meetings,
  participants,
  meetingInstances,
  refreshAccessToken,
  accessToken,
} from "./zoomhelper.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const TokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refres_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

const Token = new mongoose.model("Token", TokenSchema);

app.get("/api/zoom/zoomauth", async (req, res) => {
  try {
    return res.redirect(encodeURI(authorize()));
  } catch (error) {
    console.error("Error during authorization", error);
    return res.status(500).json({ error: "Failed to initiate authorization" });
  }
});

app.get("/api/zoom/redirect", async (req, res) => {
  // const result = await redirect(req.query.code);

  // return res.json(result);

  try {
    const { code } = req.query;
    const tokenData = await redirect(code);

    const expirationTime = new Date(Date.now() + tokenData.expires_in * 1000);
    await Token.updateOne(
      {},
      {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: expirationTime,
      },
      { upsert: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Error in redirect: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/zoom/meeting", async (req, res) => {
  try {
    const token = await Token.findOne();
    if (!token) return res.status(401).send("Unauthorized: No token found");
    const meetingList = await meetings(token.accessToken);
    res.json(meetingList);
  } catch (error) {
    console.error("Error fetching meetings: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/zoom/participants", async (req, res) => {
  const participantsList = await participants(accessToken);
  console.log("List from Index.js " + JSON.stringify(participantsList.data));
  return res.json(participantsList.data);
});

app.get("/api/zoom/meeting/instances", async (req, res) => {
  const meetingInstancesList = await meetingInstances(accessToken);

  console.log("From meeting index.js " + meetingInstancesList);

  return res.json(meetingInstancesList);
});
