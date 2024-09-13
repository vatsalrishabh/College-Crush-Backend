const { verifyJwtToken } = require('../service/auth');

const jwtMiddleware = async (req, res, next) => {
  // Extract the authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if token is provided
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Remove the 'Bearer ' prefix and any leading/trailing spaces
  const token = authHeader.replace(/^Bearer\s+/, '').trim();

  try {
    // Verify the token using the verifyJwtToken function
    const decoded = await verifyJwtToken(token);
    console.log("JWT middleware decoded:", decoded);

    if (decoded) {
      // Token is valid, attach user data to the request object
      req.user = decoded; 
      console.log("JWT middleware req.user:", req.user);

      // If you need to use `sentFrom`, `sentTo`, or `message`, ensure they are passed in the request body
      const { sentFrom, sentTo, message } = req.body;
      console.log("Sent from:", sentFrom);
      console.log("Sent to:", sentTo);
      console.log("Message:", message);

      // Proceed to the next middleware or route handler
      next();
    } else {
      // Invalid token
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    // Error during verification, usually token is expired or malformed
    return res.status(401).json({ message: 'Failed to authenticate token', error });
  }
};

module.exports = {
  jwtMiddleware,
};
