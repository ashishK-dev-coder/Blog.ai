import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Import helpers
import { validationResult } from "express-validator";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";

// Register User method .......
const registerUser = asyncHandler(async (req, res) => {
  // Validate middleware
  const errors = validationResult(req);

  console.log(errors);
  // Validate email error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      msg: "Errors",
      errors: errors.array(),
    });
  }

  // Taking data from body ...
  const { fullName, email, username, password, mobile } = req.body;

  // Checking proper data
  if (
    [fullName, email, username, password, mobile].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Checking username and email exists in database
  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { mobile }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "Already user exists ! Please try with new credentials"
    );
  }

  // Getting and checking cover image
  let documentLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.document) &&
    req.files.document.length > 0
  ) {
    documentLocalPath = req.files.document[0].path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  // Getting avatar profile
  const profileLocalPath = req.files?.profile[0]?.path;

  // Checking avatar profile ... above
  if (!profileLocalPath) {
    throw new ApiError(400, "Profile Pic is required");
  }

  // Upload avatar and coverImage on cloudinary
  const profile = await uploadOnCloudinary(profileLocalPath);
  const documentFile = await uploadOnCloudinary(documentLocalPath);

  if (!profile) {
    throw new ApiError(400, "Profile pic is required");
  }

  // Creating User
  const user = await User.create({
    fullName,
    mobile,
    profile: profile.url,
    document: documentFile?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Checking user created successfully
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Verification Email Send content
  const msg =
    "<p> Hii " +
    fullName +
    ', Please <a href="http://127.0.0.1:8880/mail-verification?id=' +
    user._id +
    '" > Verify </a> your email. </p>';

  const payload = [
    {
      email: email,
      subject: "Email Verification",
      content: msg,
    },
    {
      email: email,
      subject: "Thank you for Join Us",
      content: `<h1>Hello ${user.fullName} you got this amazing offer for Join Us 😊 </h1>`,
    },
  ];

  // Send email by Queue
  await emailQueue.add(emailQueueName, payload);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// Mail Verification during register __ { Auth Route }
const mailVerification = async (req, res) => {
  console.log(req.query.id)
  try {
    if (req.query.id == undefined) {
      return res.render("404");
    }

    const userData = await User.findOne({ _id: req.query.id });

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

      return res.render("mail-verification", {
        message: "Mail has been verified successfully",
      });
    } else {
      return res.render("mail-verification", { message: "User Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404");
  }
};

export { registerUser, mailVerification };
