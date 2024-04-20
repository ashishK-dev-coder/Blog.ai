import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Import helpers
import { validationResult } from "express-validator";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";

// Mail Verification during register __ { Auth Route }
const mailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.render('404');
    }

    const userData = await User.findOne({ _id: req.query.id }).select("-password");

    if (userData) {
      if (userData._isVerified == 1) {
        return res.render("mail-verification", {
          message: "Your email already verified",
        });
      }
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            _isVerified: 1,
          },
        }
      );

      return [res.render("mail-verification", {
        message: "Mail has been verified successfully",
      }), res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            userData,
          },
          "Mail has been verified successfully data"
        )
      )];
    } else {
      return res.render("mail-verification", { message: "User Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render('404');
  }
};

// Resend Mail verification after register __ { User Route }
const sendMailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Validate email verification errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email doesn't Exists",
      });
    }

    if (userData._isVerified == 1) {
      return res.status(400).json({
        success: false,
        msg: userData.email + " " + "Email is already verified",
      });
    }

    const msg =
      "<p> Hii " +
      userData.fullName +
      ', Please <a href="http://127.0.0.1:8882/mail-verification?id=' +
      userData._id +
      '" > Verify </a> your email. </p>';

    // Verification Email Send content
    const payload = [
      {
        email: email,
        subject: "Resend Email Verification",
        content: msg,
      },
    ];

    // Send email by Queue
    const emailQueueVar = await emailQueue.add(emailQueueName, payload);

    if (emailQueueVar.success == undefined) {
      return res.status(200).json({
        success: true,
        msg: "Verification mail send to your email",
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Resent Verification mail not send",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

export { sendMailVerification , mailVerification};
