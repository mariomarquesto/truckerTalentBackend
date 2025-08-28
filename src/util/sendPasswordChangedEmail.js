const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const createTransporter = async () => {
  const accessToken = (await oAuth2Client.getAccessToken()).token;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
  });
};

const sendPasswordChangedEmail  = async (email) => {
  const emailOptions = {
    from: `"Truckers Talents INC." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your password has been changed",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="color: #7F1022;">Password Changed</h1>
        <p>If you changed your password, no action is needed.</p>
        <p>If you did <strong>not</strong> change your password, please contact support immediately.</p>
        <p style="font-style: italic;">- Truckers Talents INC</p>
      </div>
    `,
  };

  const transporter = await createTransporter();
  await transporter.sendMail(emailOptions);
};

module.exports = sendPasswordChangedEmail;
