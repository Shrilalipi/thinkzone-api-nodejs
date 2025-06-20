import jwt from 'jsonwebtoken';

export const generateAccesstoken = (userObj) => {
    try {
        console.log("userObj :: ", userObj);
        const token = jwt.sign(userObj.toObject(), process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        return token;
    } catch (err) {
        console.error(err);
        return null;
    }
}