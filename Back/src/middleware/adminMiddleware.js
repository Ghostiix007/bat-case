const adminMiddleware = (req, res, next) => {
    if(!req.user || !req.user.role !== "ADMIN"){
        return res.status(403).json({ message: "Access denied, you need to be admin" });
    }
    next()
}

module.exports = adminMiddleware