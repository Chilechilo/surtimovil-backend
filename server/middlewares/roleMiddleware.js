export const verifyAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Token missing or invalid"
    });
  }

  if (req.user.role === "admin" || req.user.role === "superuser") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied — Admin only"
  });
};
