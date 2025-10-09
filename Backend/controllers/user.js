import User from '../models/user.js';


async function handleUserSignup(req, res) {
    const { userName, email, password } = req.body;

    await User.create({ userName, email, password });
    res.status(200).json({ message: "User created successfully" });
}

async function handleUserLogin(req, res) {
    // console.log("Inside handleUserLogin");
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const token = await User.matchPasswordAndGenerateToken(email, password);
        if (!token) {
            res.status(404).json({ message: "Password didnot match" });
        }
        res.cookie("uid", token, {
            httpOnly: true,
            sameSite: "lax", // or "none" if using https
            secure: false,   // true if https
        })

        res.status(200).json({ message: "User login successfully " });
    }
    catch (error) {
        res.status(404).json({
            message: "Incorrect email or password!"
        });
    }
}

async function handleUserLogout(req, res) {
    res.clearCookie('uid', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
}

async function verify_login(req, res) {
    if (req.user) {
        // console.log("Inside verify_login", req.cookies);
        res.status(200).json({ message: "User is logged in", valid: true });
    }
    else {
        res.status(401).json({ message: "User is not logged in", valid: false });
    }
}


export { handleUserSignup, handleUserLogin, handleUserLogout, verify_login };