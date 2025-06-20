import jwt from 'jsonwebtoken';

export const verifyAccesstoken = (accessToken) => {
    try {
        const decodedObject = jwt.verify(accessToken, process.env.JWT_SECRET);
        return decodedObject;
    } catch (err) {
        throw new Error(err);
    }
}