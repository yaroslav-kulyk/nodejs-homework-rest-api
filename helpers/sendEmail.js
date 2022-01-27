const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_VERIFIED_SENDER } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const email = { ...data, from: SENDGRID_VERIFIED_SENDER };
    await sgMail.send(email);
    console.log("email successfully sent");
    return true;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = sendEmail;
