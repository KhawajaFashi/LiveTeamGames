import User from '../models/user.js';
import { generateToken, getUser } from '../service/auth.js';


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
        console.log("Right Here 1")
        const token = await matchPasswordAndGenerateToken(email, password);
        if (!token) {
            res.status(404).json({ message: "Password didnot match" });
        }
        res.cookie("uid", token, {
            httpOnly: true,
            sameSite: "lax", // or "none" if using https
            secure: false,   // true if https
        })
        // console.log("Token generated:", token);
        const user = getUser(token);
        // console.log("Right Here 2", user)

        res.status(200).json({ message: "User login successfully ", valid: true, user: user, token: token });
    }
    catch (error) {
        res.status(404).json({
            message: "Incorrect email or password!",
            valid: false
        });
    }
}

async function handleUserLogout(req, res) {
    res.clearCookie('uid', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
}


async function verify_login(req, res) {
    console.log("Inside verify_login", req.user, req.body);
    if (req.user) {
        const token = req.body.token;
        if (!token) {
            res.status(401).json({ message: "Token Not Available", valid: false });
        }
        else {
            const verifiedUser = getUser(token);
            console.log("Why in verify_login", JSON.stringify(verifiedUser), JSON.stringify(req.user), JSON.stringify(req.user) === JSON.stringify(verifiedUser));
            if (JSON.stringify(req.user) === JSON.stringify(verifiedUser))
                res.status(200).json({ message: "User is logged in", valid: true, user: req.user });
            else
                res.status(401).json({ message: "User token not correct", valid: false });
        }
    }
    else {
        res.status(401).json({ message: "User is not logged in", valid: false });
    }
}


async function uploadData(req, res) {
    const userId = req.user ? req.user._id : null;

    try {
        // console.log("Data received for update:", data, req.user);
        const user = await User.findById(userId);
        console.log("User found for update:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const data = { ...req.body, userName: req.user.userName, email: req.user.email };;
        const token = await matchPasswordAndGenerateToken(data.email, data.password)
        if (!token) {
            console.log("Password did not match");
            res.status(404).json({ message: "Password didnot match" });
            return;
        }
        if (data.newPassword && data.newPassword.length > 0) {
            data.password = data.newPassword;
        }
        // data =
        console.log("Data received for update:", data, token);

        user.set(data);
        // console.log("User profile set:", user);
        await user.save();
        // console.log("User profile saved:", user);


        res.status(200).json({ message: "Profile updated successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Profile has not been updated" });
    }

}


async function fetchUserProfile(req, res) {
    // console.log("Inside fetchUserProfile", req.headers.cookie.startsWith("uid"));
    console.log("Inside fetchUserProfile 2", req.headers?.cookie?.split(" ")[0].split("=")[1]);
    const userId = req.user ? req.user._id : null;
    try {
        const user = await User.findById(userId);
        // console.log("User found for update:", user, req.user);
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", user: user });

    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Profile has not been fetched" });
    }
}


async function matchPasswordAndGenerateToken(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found!");
    const Password = user.password;
    if (password !== Password) return null;
    const token = generateToken(user);
    console.log("Generated Token:", token);
    return token;
}



export {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
    verify_login,
    uploadData,
    fetchUserProfile
};