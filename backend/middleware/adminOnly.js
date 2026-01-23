module.exports = (req, res, next) => {
    console.log("ADMIN CHECK:", req.user);
  if (req.user.jogosultsag != process.env.ADMIN_JOGOSULTSAG) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
