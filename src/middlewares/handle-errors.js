export const handleErrors = (err, req, res, next) => {
    if (!err) {
        return res.status(500).json({
            success: false,
            message: "Unknown error occurred"
        });
    }
    
    if (err.status === 400 || (err.errors && Object.keys(err.errors).length > 0)) {
        return res.status(400).json({
            success: false,
            errors: err.errors || { general: err.message || "Validation error" }
        });
    }
    
    if (err.status === 401 || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: err.message || "Authentication error"
        });
    }
    
    console.error("Server error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
}