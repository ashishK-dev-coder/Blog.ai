import { check } from "express-validator";

// Register validation
export const registerValidator = [
  check("username", "Username is required").not().isEmpty(),
  check("fullName", "fullName is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("mobile", "Mobile No. must be 10 digit").isLength({
    min: 10,
    max: 10,
  }),
  check(
    "password",
    "Password must be greater than 6 character , and contain one uppercase letter - one lowercase - one number - one special charcter"
  ).isStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  check("profile")
    .custom((value, { req }) => {
      if (
        req.files.profile[0].mimetype === "image/jpeg" ||
        req.files.profile[0].mimetype === "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload an image .jpeg , .png"),
  check("document")
    .custom((value, { req }) => {
      if (
        req.files.document[0].mimetype === "application/msword" ||
        req.files.document[0].mimetype === "application/pdf"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload pdf or doc format"),
];

