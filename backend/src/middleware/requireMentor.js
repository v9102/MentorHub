export const requireMentor = (req, res, next) => {
  const role = req.auth.sessionClaims?.publicMetadata?.role;

  if (role !== "mentor") {
    return res.status(403).json({ error: "Mentor access only" });
  }

  next();
};
