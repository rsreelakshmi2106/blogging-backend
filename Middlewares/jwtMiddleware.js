const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwt middleware");

    try{
        const token = req.headers['authorization'].slice(7)
        console.log(token);

        const jwtverification = jwt.verify(token,"super2024")
        console.log(jwtverification);
        req.payload = jwtverification.userId
        // console.log(req.payload);
        next()
    }
    catch(err){
        res.status(401).json({"AuthorizationError":err.message})
    }
}

module.exports = jwtMiddleware