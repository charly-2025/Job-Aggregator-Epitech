import jwt from "jsonwebtoken"

const middleware = (req, res, next) => {

  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized. No token.'
    });
  }
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   

    next();
  } catch {
    return res.status(401).json({
     message: "Invalid or expired token",
    });
  }
};

export default middleware;