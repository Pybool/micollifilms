const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();
let transporter;
try {
  console.log({
    service: process.env.EMAIL_HOST,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

 
} catch {console.log("Error occured in mail")}


const sendMail = async(mailOptions) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    })
  };

module.exports = sendMail;
