import { clerkClient } from "@clerk/clerk-sdk-node";

const protectUser = (req, res, next) => {
  try {
    const auth = req.auth(); // ✅ correct (no deprecation warning)

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ attach userId to request
    req.userId = auth.userId;

    next();
  } catch (error) {
    console.error("protectUser error:", error);

    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default protectUser;