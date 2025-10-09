import jwt from 'jsonwebtoken';

const secret = "mysecretkey";

const generateToken = (user) => {
    const payload = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
    }

    const token = jwt.sign(payload, secret);
    return token;
}

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

function getUser(token) {
    try {
        return jwt.verify(token, secret);
    } catch (e) {
        return null;
    }
}

export { generateToken, validateToken, getUser };