import randomstring from "randomstring";
import bcrypt from "bcrypt";

// Import Models
import {User} from "../models/user.model.js";
import PasswordReset from "../models/passwordReset.js";

// Import helpers
import { validationResult } from "express-validator";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";



// Forget Password __ { User Route }
const forgetPassword = async (req, res) => {
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

    const randomString = randomstring.generate();
    const msg =
      "<p>Hi " +
      userData.fullName +
      ', Please click <a href="http://127.0.0.1:8883/reset-password?token=' +
      randomString +
      '"> Here </a> to reset your password </p>';

    await PasswordReset.deleteMany({ user_id: userData._id });

    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randomString,
    });
    await passwordReset.save();

    // Verification Email Send content
    const payload = [
      {
        email: email,
        subject: "Reset Password",
        content: msg,
      },
    ];

    // Send email by Queue
    const emailQueueVar = await emailQueue.add(emailQueueName, payload);

    if (emailQueueVar.success == undefined) {
      return res.status(200).json({
        success: true,
        msg: "Reset password link send to your email , please check",
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Sorry Reset password not generated at this moment",
      });
    }

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// Reset Password with Ejs __ { Auth Route }
const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render('404');
    }

    const resetData = await PasswordReset.findOne({ token: req.query.token });

    if (!resetData) {
      return res.render('404');
    }

    return res.render('reset-password', { resetData });
  } catch (error) {
    return res.render('404');
  }
};

// Update Password  __ { Auth Route } reset password method
const updatePassword = async (req, res) => {
  try {
    const { user_id, password, c_password } = req.body;

    const resetData = await PasswordReset.findOne({ user_id });

    if (password != c_password) {
      return res.render("reset-password", {
        resetData,
        error: "Confirm Password not match",
      });
    }

    const hashedPassword = await bcrypt.hashSync(c_password, 10);

    await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    PasswordReset.deleteMany({ user_id });

    return res.redirect("/reset-success");
  } catch (error) {
    return res.render("404");
  }
};

// Reset Succcess __ { Auth Route }
const resetSuccess = async (req, res) => {
  try {
    return res.render("reset-success");
  } catch (error) {
    return res.render("404");
  }
};

export { forgetPassword , resetPassword , updatePassword , resetSuccess };
