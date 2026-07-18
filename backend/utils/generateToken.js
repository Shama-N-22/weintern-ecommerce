const jwt = require("jsonwebtoken");

// Creates a signed JWT containing the user's id and role.
// JWT_SECRET must be added to backend/.env (shared file, ping the group).
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
