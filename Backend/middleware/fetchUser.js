require('dotenv').config({ path: './Backend/.env.local' });
var jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    const success = false;
    if (!token) {
        res.status(401).send({ success, error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, secretKey);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ success, error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchuser;