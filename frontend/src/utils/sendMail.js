const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (userEmail, userName) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password" // ⚠️ normal password nahi, app password
    }
  });

  const mailOptions = {
    from: "Mannlytics <your_email@gmail.com>",
    to: userEmail,
    subject: "Welcome to Mannlytics 💜",
    html: `
      <h2>Hey ${userName} 👋</h2>
      <p>Welcome to <b>Mannlytics</b> 💜</p>
      <p>Your mental wellness journey starts here 🧠</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendWelcomeEmail;