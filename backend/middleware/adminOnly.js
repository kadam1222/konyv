module.exports = (req, res, next) => {
    console.log("ADMIN CHECK:", req.user);
    const Admin_Role = Number(process.env.ADMIN_JOGOSULTSAG)
  if (Number(req.user.jogosultsag) !== Admin_Role) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
