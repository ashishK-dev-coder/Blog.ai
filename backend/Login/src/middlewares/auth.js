import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"] || req.cookies.accessToken

    console.log(req.body)

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "A token is required for authentication",
    });
  }

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];


    const decodedData = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("decoded", decodedData)

    req.user = decodedData;
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid Token",
    });
  }

  return next();
};

export default verifyToken;
