module.exports = (req, res, next) => {
    console.log("ADMIN CHECK:", req.user);
  if (req.user.jogosultsag != 2) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
