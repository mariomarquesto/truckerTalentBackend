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

const getAccessToken = async () => {
  const accessTokenResponse = await oAuth2Client.getAccessToken();
  if (!accessTokenResponse.token) throw new Error("Failed to generate access token");
  return accessTokenResponse.token;
};

const createTransporter = async () => {
  const accessToken = await getAccessToken();
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

const sendPasswordResetCodeEmail = async (email, code) => {
  const emailOptions = {
    from: `"Truckers Talents INC." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password recovery request",
    html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="text-align: center; font-size: 1.5rem; color: #7F1022;">Recover your account.</h1>
          <p style="font-size: 1rem;">
            Recovery the access to your account with the next info. Verify your request with the next verification code:
          </p>
          <p style="text-align: center; color: #7F1022; font-size: 1.5rem; margin: 0.5rem;">
            <strong>${code}</strong>
          </p>
          <p style="font-size: 1rem;">
            Go with your code to the change page:
          </p>
          <a href="${process.env.FRONTEND_URL}/recover"
            style="
              display: inline-block;
              padding: 12px 24px;
              margin: 1rem;
              background-color: #7F1022;
              color: #ffffff;
              font-size: 1rem;
              text-decoration: none;
              border-radius: 8px;
              text-align: center;
            ">
            Change Password
          </a>
          <p style="font-size: 1rem;">
            If the button doesn't work, go to the following link to verify your email:
            <a style="font-size: 1rem; color: #7F1022;" href="${process.env.FRONTEND_URL}/change">
              ${process.env.FRONTEND_URL}/change
            </a>
          </p>
          <p style="font-size: 1rem; font-style: italic;">
            Your code will expire in 15 minutes. Please, verify as soon as possible.
          </p>
          <p style="font-size: 1rem;">
            If you did not create an account, please ignore this email.
          </p>
        </div>
    `,
  };

  try {
    const transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
  } catch (err) {
    console.warn("⚠️ First attempt to send email failed. Retrying...", err.message);
    try {
      const transporterRetry = await createTransporter(); // genera nuevo token
      await transporterRetry.sendMail(mailOptions);
    } catch (finalErr) {
      console.error("❌ Failed to send email after retry:", finalErr);
      throw new Error("Error sending email, even after retry.");
    }
  }
};

module.exports = sendPasswordResetCodeEmail;