const protectRecruiter = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // You can improve this later (JWT verify etc)
  next();
};

export default protectRecruiter;