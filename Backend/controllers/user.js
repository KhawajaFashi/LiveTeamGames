import User from '../models/user.js';
import { generateToken, getUser } from '../service/auth.js';
import nodemailer from "nodemailer";
import { marked } from "marked"; // npm install marked

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
        // console.log("Right Here 1")
        const token = await matchPasswordAndGenerateToken(email, password);
        if (!token) {
            res.status(404).json({ message: "Password didnot match" });
        }
        res.cookie("uid", token, {
            httpOnly: true,
            sameSite: "none", // or "none" if using https
            secure: true,   // true if https
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
    // console.log("Inside verify_login", req.user, req.body);
    if (req.user) {
        const token = req.body.token;
        if (!token) {
            res.status(401).json({ message: "Token Not Available", valid: false });
        }
        else {
            const verifiedUser = getUser(token);
            // console.log("Why in verify_login", JSON.stringify(verifiedUser), JSON.stringify(req.user), JSON.stringify(req.user) === JSON.stringify(verifiedUser));
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
        // console.log("User found for update:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const data = { ...req.body, userName: req.user.userName, email: req.user.email };
        if (data.password !== '') {
            const token = await matchPasswordAndGenerateToken(data.email, data.password)
            if (!token) {
                console.log("Password did not match");
                res.status(404).json({ message: "Password didnot match" });
                return;
            }
            if (data.newPassword && data.newPassword.length > 0) {
                data.password = data.newPassword;
            }
        }
        else {
            // Keep the existing password if none was provided
            data.password = user.password;
        }
        // data =
        // console.log("Data received for update:", data, token);

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

async function uploadDataWithEmail(req, res) {
    const userId = req.user ? req.user._id : null;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const data = { ...req.body, userName: req.user.userName, email: req.user.email };
        console.log("Data:", data)
        if (data.password !== '') {
            const token = await matchPasswordAndGenerateToken(data.email, data.password)
            if (!token) {
                console.log("Password did not match");
                res.status(404).json({ message: "Password didnot match" });
                return;
            }
            if (data.newPassword && data.newPassword.length > 0) {
                data.password = data.newPassword;
            }
        }

        const emailData = { senderEmailName: data.senderEmailName, replyEmail: data.replyEmail, emailSubject: data.emailSubject, emailContent: data.emailContent, emailLang: data.emailLang };

        sendMail(emailData);

        if (data.password === '') {
            // Keep the existing password if none was provided
            data.password = user.password;
        }

        user.set(data);
        await user.save();


        res.status(200).json({ message: "Profile updated successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Profile has not been updated" });
    }
}

export async function sendMail(emailData) {
    const { senderEmailName, replyEmail, emailSubject, emailContent, emailLang } = emailData;

    try {
        // Convert Markdown to HTML
        const htmlContent = marked.parse(emailContent);

        // Create transporter (use your SMTP or service credentials)
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use host, port, auth
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        console.log("Prepared email content:");
        
        // Mail options
        const mailOptions = {
            from: `${process.env.SMTP_USER}`,
            to: replyEmail,
            subject: emailSubject,
            text: emailContent, // fallback plain text
            html: htmlContent,
        };
        console.log("Mail Options:",mailOptions);

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
}

async function fetchUserProfile(req, res) {
    // console.log("Inside fetchUserProfile", req.headers.cookie.startsWith("uid"));
    // console.log("Inside fetchUserProfile 2", req.headers?.cookie?.split(" ")[0].split("=")[1]);
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

async function getUserMedia(req, res) {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, media: user.media || [] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching media' });
    }
}

async function addUserMedia(req, res) {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
        const { folderName = 'home', name, path, size } = req.body;
        if (!name || !path) return res.status(400).json({ success: false, message: 'name and path are required' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.media = user.media || [];
        let folder = user.media.find(f => f.folderName === folderName);
        if (!folder) {
            folder = { folderName, images: [] };
            user.media.push(folder);
        }

        // Calculate size in MB if provided in bytes
        const sizeInMB = size ? Math.round((size / (1024 * 1024)) * 100) / 100 : 0;

        // avoid duplicates
        const exists = folder.images.find(img => img.name === name && img.path === path);
        if (exists) {
            // Update existing file's size and modified time
            const oldSizeInMB = exists.size || 0;
            exists.size = sizeInMB;
            exists.modifiedTime = new Date();
            // Adjust total storage
            user.storageUsed.size = Math.max(0, (user.storageUsed.size || 0) - oldSizeInMB + sizeInMB);
        } else {
            folder.images.push({
                name,
                path,
                size: sizeInMB,
                modifiedTime: new Date()
            });
            // Add to total storage
            user.storageUsed.size = (user.storageUsed.size || 0) + sizeInMB;
        }

        await user.save();
        return res.status(200).json({ success: true, media: user.media });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error adding media' });
    }
}

async function deleteUserMedia(req, res) {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
        const { folderName = 'home', name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'name is required' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.media = user.media || [];
        const folder = user.media.find(f => f.folderName === folderName);
        if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

        // Find the file to get its size before removing
        const fileToDelete = folder.images.find(img => img.name === name);
        if (fileToDelete && fileToDelete.size) {
            // Subtract file size from total storage
            user.storageUsed.size = Math.max(0, (user.storageUsed.size || 0) - (fileToDelete.size || 0));
        }

        folder.images = folder.images.filter(img => img.name !== name);
        await user.save();
        return res.status(200).json({ success: true, media: user.media });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error deleting media' });
    }
}


async function matchPasswordAndGenerateToken(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found!");
    const Password = user.password;
    if (password !== Password) return null;
    const token = generateToken(user);
    // console.log("Generated Token:", token);
    return token;
}

export {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
    uploadDataWithEmail,
    verify_login,
    uploadData,
    fetchUserProfile,
    getUserMedia,
    addUserMedia,
    deleteUserMedia
};