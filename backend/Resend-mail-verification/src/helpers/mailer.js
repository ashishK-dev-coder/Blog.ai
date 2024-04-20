import nodemailer from "nodemailer";

// process.env.SMTP_HOST

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (email, subject, content) => {
  try {
    let mailOption = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      }

      console.log("Mail sent", info.messageId);
    });
  } catch (error) {
    console.log(error.message);
  }
};

export { sendMail };
