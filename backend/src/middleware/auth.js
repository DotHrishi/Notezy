const requireAuth = (req, res, next) => {
    // For local development, bypass authentication
    if (process.env.NODE_ENV !== "production") {
        // Create a mock user for local development
        req.user = {
            id: "dev-user-id",
            name: "Dev User",
            email: "dev@example.com",
            googleId: "dev-google-id"
        };
        return next();
    }
    
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "Not authenticated", requireAuth: true });
};

export default requireAuth;