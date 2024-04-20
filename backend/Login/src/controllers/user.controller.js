import path from "path";
import bcrypt from "bcrypt";

// Import Utils
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Import Models
import { BlackList } from "../models/blackList.js";
import { User } from "../models/user.model.js";

// Import helpers
import { validationResult } from "express-validator";
import deleteFile from "../helpers/deleteFile.js";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";

// Generate access and refresh token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
      error
    );
  }
};

// Login User Method .......
const loginUser = asyncHandler(async (req, res) => {
  // Validate middleware
  const errors = validationResult(req);

  // Validate email error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      msg: "Errors",
      errors: errors.array(),
    });
  }

  // Taking data from body
  const { email, username, password, mobile } = req.body;
  console.log(email, username, password, mobile);

  // Checking username and email present or not
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Getting user data from database
  const user = await User.findOne({
    $or: [{ username }, { email }, { mobile }],
  });

  console.log(user)

  // Checking user present or not
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Checking password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Geneerate Access and Refresh Token
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  // Check LoggedIn user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Verification Email Send content
  const payload = [
    {
      email: email,
      subject: "Logged in alert message",
      content: `<h1>Hello ${user.fullName} login detect </h1>`,
    },
  ];

  // Send email by Queue
  await emailQueue.add(emailQueueName, payload);

  const options = {
    httpOnly: true,
    secure: true,
  };
  // Return A & R Token in cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// Get User Profile __ { User Profile }
const userProfile = asyncHandler(async (req, res) => {
  try {
    const userData = req.user;

    console.log(req.user);

    return res.status(200).json({
      success: true,
      msg: "User Profile Data",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

// Update user profile __ { Update Profile }
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log("req.user._id", req.user._id);
    console.log("req.params.id", req.params.id);

    if (req.user._id !== req.params.id) {
      // return next(errorHandler(401, 'You can update only your account!'));
      throw new ApiError(401, "Unauthorised User !");
    }

    // Validate email error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { username, email, password, profile } = req.body.formData;

    const user_id = req.user._id;
    console.log("userId", req.user._id);

    // Fetch existing user data
    const existingUserData = await User.findById(user_id);

    console.log('existing User Data',existingUserData)

    // Create an object to store only the fields that need to be updated
    const updatedData = {};

    console.log("updatedData", updatedData);

    // Compare incoming data with existing user data
    if (username !== existingUserData.username) {
      updatedData.username = username;
    }
    if (email !== existingUserData.email) {
      updatedData.email = email;
    }
    if (password !== existingUserData.password) {
      updatedData.password = password;
    }
    if (profile !== existingUserData.profile) {
      updatedData.profile = profile;
    }

    if (Object.keys(updatedData).length > 0) {
      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: updatedData,
        },
        { new: true }
      );

      // Return updated user data
      return res.status(200).json({
        success: true,
        msg: "User Updated Successfully",
        user: userData,
      });
    } else {
      // Fetch existing user data if no changes detected
      const userData = await User.findById(user_id);

      // Return existing user data
      return res.status(200).json({
        success: true,
        msg: "No Update detected",
        user: userData,
      });
    }

    // Update user data only if there are changes
    // if (Object.keys(updatedData).length > 0) {
    //   const userData = await User.findByIdAndUpdate(
    //     { _id: user_id },
    //     {
    //       $set: updatedData,
    //     },
    //     { new: true }
    //   );

    //   // Return updated user data
    //   return res.status(200).json({
    //     success: true,
    //     msg: "User Updated Successfully",
    //     user: userData,
    //   });
    // } else {
    //   // No changes detected, return the existing user data
    //   return res.status(200).json({
    //     success: true,
    //     msg: "No Update detect ",
    //     user: userData,
    //   });
    // }

    // console.log("username", username)
    // console.log("email", email)
    // console.log("password", password)
    // console.log("profile", profile)

    // const data = {
    //   username,
    //   email,
    //   password,
    //   profile
    // };

    // console.log("userId", req.user._id)
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });

    // if (req.file != undefined) {
    //   data.image = "image/" + req.file.filename;

    // const oldUser = await User.findOne({ _id: user_id });

    //   const oldFilePath = path.join(__dirname, "../public" + oldUser.image);

    //   deleteFile(oldFilePath);
    // }

    // const userData = await User.findByIdAndUpdate(
    //   { _id: user_id },
    //   {
    //     $set: data,
    //   },
    //   { new: true }
    // );
  }
};

// Refresh Token __ { User Route }
const refreshToken = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.user._id;

    const userData = await User.findOne({ _id: userId });

    const accessToken = await generateAccessToken({ user: userData });
    const refreshToken = await generateRefreshToken({ user: userData });

    return res.status(200).json({
      success: true,
      msg: "Token Refreshed",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

// Google Auth
const google = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (user) {
      // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(user._id);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      const payload = [
        {
          email: email,
          subject: "Logged in alert with Google ",
          content: `<h1>Hello ${user.fullName} login detect </h1>`,
        },
      ];

      // Send email by Queue
      await emailQueue.add(emailQueueName, payload);

      const options = {
        httpOnly: true,
        secure: true,
        expires: expiryDate,
      };
      res
        // .cookie('access_token', token, {
        //   httpOnly: true,
        //   expires: expiryDate,
        // })
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              user: rest,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
        );
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profile: req.body.photo,
        fullName: req.body.name,
      });
      await newUser.save();
      // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(newUser._id);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      const payload = [
        {
          email: email,
          subject: "Signup Success with Google",
          content: `<h1>Hello ${newUser.fullName} login detect </h1>`,
        },
      ];

      // Send email by Queue
      await emailQueue.add(emailQueueName, payload);

      const options = {
        httpOnly: true,
        secure: true,
        expires: expiryDate,
      };
      res
        // .cookie('access_token', token, {
        //   httpOnly: true,
        //   expires: expiryDate,
        // })
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              user: rest,
              accessToken,
              refreshToken,
            },
            "User Signed up Successfully with gmail"
          )
        );
    }
  } catch (error) {
    next(error);
  }
};

// Logout __ { User Route }
const logout = asyncHandler(async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];

    const bearer = token.split(" ");

    const bearerToken = bearer[1];

    const newBlacklist = new BlackList({ token: bearerToken });

    await newBlacklist.save();

    res.setHeader("Clear-Site-Data", '"cookies", "storage"');

    return res.status(200).json({
      success: true,
      msg: "You are logged out successfull",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

// delete user
const deleteUser = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    // return next(errorHandler(401, 'You can delete only your account!'));
    throw new ApiError(401, "You can delete only your account!");
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    // return next(errorHandler(401, 'You can update only your account!'));
    throw new ApiError(401, "You can update only your account!");
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export {
  loginUser,
  userProfile,
  updateProfile,
  refreshToken,
  logout,
  google,
  deleteUser,
};
