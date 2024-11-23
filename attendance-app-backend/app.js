import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { zoomAuth, zoomRedirect, getToken, getMeetings, getParticipants, getMeetingInstances } from "./controllers/zoomController.js";

mongoose
  .connect(process.env.MONGO_URI)
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

// Routes
app.get("/api/zoom/zoomauth", zoomAuth);
app.get("/api/zoom/redirect", zoomRedirect);
app.get("/api/zoom/meeting", getMeetings);
app.get("/api/zoom/participants", getParticipants);
app.get('/api/zoom/token', getToken); // This will provide the stored token to the frontend
app.get('/api/zoom/instances/:id', getMeetingInstances)






















// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import {
//   authorize,
//   redirect,
//   meetings,
//   participants,
//   meetingInstances,
//   refreshAccessToken,
// } from "./zoomhelper.js";
// import mongoose from "mongoose";

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB: ", err));

// const app = express();
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

// const TokenSchema = new mongoose.Schema({
//   access_token: { type: String, required: true },
//   refresh_token: { type: String, required: true },
//   expires_at: { type: Date, required: true },
// });

// const Token = mongoose.model("Token", TokenSchema);

// // Initiate Zoom OAuth authorization
// app.get("/api/zoom/zoomauth", (req, res) => {
//   try {
//     return res.redirect(encodeURI(authorize()));
//   } catch (error) {
//     console.error("Error during authorization", error);
//     return res.status(500).json({ error: "Failed to initiate authorization" });
//   }
// });

// // Handle Zoom OAuth redirect and token exchange
// app.get("/api/zoom/redirect", async (req, res) => {
//   try {
//     const { code } = req.query;
//     const tokenData = await redirect(code);

//     const expirationTime = new Date(Date.now() + tokenData.expires_in * 1000);
//     await Token.updateOne(
//       {},
//       {
//         access_token: tokenData.access_token,
//         refresh_token: tokenData.refresh_token,
//         expires_at: expirationTime,
//       },
//       { upsert: true }
//     );

//     res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
//   } catch (error) {
//     console.error("Error in redirect: ", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Fetch meeting list
// app.get("/api/zoom/meeting", async (req, res) => {
//   try {
//     const token = await Token.findOne();
//     if (!token) return res.status(401).send("Unauthorized: No token found");

//     const currentTime = Date.now();
//     if (currentTime > new Date(token.expires_at).getTime()) {
//       // Token expired, refresh it
//       const refreshedTokenData = await refreshAccessToken();
//       await Token.updateOne({}, {
//         access_token: refreshedTokenData.access_token,
//         refresh_token: refreshedTokenData.refresh_token,
//         expires_at: new Date(Date.now() + refreshedTokenData.expires_in * 1000),
//       });
//     }

//     const meetingList = await meetings(token.access_token);
//     res.json(meetingList);
//   } catch (error) {
//     console.error("Error fetching meetings: ", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Fetch participants list
// app.get("/api/zoom/participants", async (req, res) => {
//   try {
//     const token = await Token.findOne();
//     if (!token) return res.status(401).send("Unauthorized: No token found");

//     const participantsList = await participants(token.access_token);
//     console.log("Participants List: ", participantsList.data);
//     return res.json(participantsList.data);
//   } catch (error) {
//     console.error("Error fetching participants: ", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Fetch meeting instances
// app.get("/api/zoom/meeting/instances", async (req, res) => {
//   try {
//     const token = await Token.findOne();
//     if (!token) return res.status(401).send("Unauthorized: No token found");

//     const meetingInstancesList = await meetingInstances(token.access_token);
//     console.log("Meeting Instances: ", meetingInstancesList);
//     return res.json(meetingInstancesList);
//   } catch (error) {
//     console.error("Error fetching meeting instances: ", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
