const jwt = require("jsonwebtoken");
const { blacklistedTokens } = require("../controllers/konyvekcontrollers");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Hiányzó token" });
  }

  const token = authHeader.split(" ")[1];

  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token kijelentkeztetve" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Érvénytelen token" });
  }
};
