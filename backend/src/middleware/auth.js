const requireAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    return res.status(404),json({message:"User not created!", requireAuth:true});
};

export default requireAuth;