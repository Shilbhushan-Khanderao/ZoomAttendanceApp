import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

const Token = mongoose.model("Token", TokenSchema);

export default Token;
