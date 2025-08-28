const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
console.log("CLIENT_ID: ", CLIENT_ID);
console.log("CLIENT_SECRET: ", CLIENT_SECRET);

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Paso 1: Obtén una URL para autorizar tu cuenta
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log("Authorize this app by visiting this url:", authUrl);
