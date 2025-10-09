import { getUser } from "../service/auth.js";

// async function restrictToLoggedinUserOnly(req, res, next) {
//     const userUid = req.cookies?.uid;

//     // console.log("User UID from cookie:", userUid);
//     if (!userUid) return res.redirect("/login");
//     const user = getUser(userUid);
//     console.log("User from getUser function:", user);
//     // console.log("User from session map:", user);

//     if (!user) return res.redirect("/login");
    

//     req.user = user;
//     next();
// }


async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid || req.body?.token || req.headers?.authorization?.split(" ")[1];
    // console.log('Cookie received:', req.cookies);
    // console.log(JSON.stringify(req, null, 2));
    // console.log(`User UID from cookie in checkAuth middleware: ${userUid}`);

    const user = getUser(userUid);
    
    req.user = user;
    // console.log(`User from checkAuth middleware: ${user} and ${req.user}`);
    next();
}

export {
    // restrictToLoggedinUserOnly,
    checkAuth,
};