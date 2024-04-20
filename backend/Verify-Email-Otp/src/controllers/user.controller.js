
// Import Models
import {User} from "../models/user.model.js";
import Otp from "../models/otp.js";

// Import helpers
import { validationResult } from "express-validator";
import { oneMinuteExpiry, threeMinuteExpiry } from "../helpers/otpValidate.js";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";

// Method of Generate Random 4 Digit
const generateRandom4Digit = async () => {
  return  Math.floor(1000 + Math.random() * 9000);
 };

// Send Email Otp __ { User Route }
const sendOtp = async (req, res) => {
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

    const generate_otp = await generateRandom4Digit();

    const oldOtpdata = await Otp.findOne({ user_id: userData._id });

    if (oldOtpdata) {
      const sendNextOtp = await oneMinuteExpiry(oldOtpdata.timestamp);
      if (!sendNextOtp) {
        return res.status(400).json({
          success: false,
          msg: "Please try after 1 minute",
        });
      }
    }

    const current_date = new Date();

    await Otp.findOneAndUpdate(
      { user_id: userData._id },
      { otp: generate_otp, timestamp: new Date(current_date.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // const enter_otp = new Otp({
    //   user_id: userData.id,
    //   otp: generate_otp,
    // });

    // await enter_otp.save();

    const msg =
      "<p> Hii <b>" +
      userData.fullName +
      "<b/> , <h4>" +
      generate_otp +
      "</h4> </p>";

    // Verification Email Send content
    const payload = [
      {
        email: email,
        subject: "Otp verification",
        content: msg,
      },
    ];

    // Send email by Queue
    const emailQueueVar = await emailQueue.add(emailQueueName, payload);

    if (emailQueueVar.success == undefined) {
      return res.status(200).json({
        success: true,
        msg: "Otp has been send to your email",
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Sorry , Otp is not send currently",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// Verify Otp __ { User Route }
const verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Validate email error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { user_id, otp } = req.body;

    const otpData = await Otp.findOne({
      user_id,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        msg: "You entered wrong otp",
      });
    }

    const isOtpExpired = await threeMinuteExpiry(otpData.timestamp);

    if (isOtpExpired) {
      return res.status(400).json({
        success: false,
        msg: "Your otp has been expired",
      });
    }

    await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          _isVerified: 1,
        },
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Your account has been verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

export {
  sendOtp,
  verifyOtp,
};
