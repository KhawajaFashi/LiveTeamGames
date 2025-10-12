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

    const userUid =
        req.cookies?.uid ||
        // (req.headers?.cookie?.startsWith("uid")
        req.headers?.cookie?.split(" ")[0].split("=")[1] ||
        req.body?.token

    // console.log(`\n\n\nUser UID from cookie: ${req.cookies?.uid}\n\n\n\n`);
    // console.log(`\n\n\nUser from checkAuth middleware: ${req.headers?.cookie?.split(" ")[0].split("=")[1]}\n\n\n\n`);
    // console.log(`\n\n\nUser UID from body: ${req.body?.token}\n\n\n\n`);

    // console.log('Cookie received:', req.cookies);
    // console.log(JSON.stringify(req, null, 2));
    // console.log(`Req body from middleware: ${req.body} `);
    // console.log(`Req cookies from middleware: ${req.cookies} `);

    const user = getUser(userUid);
    
    req.user = user;
    // console.log(`User from checkAuth middleware: ${user} and ${req.user}`);
    next();
}

export {
    // restrictToLoggedinUserOnly,
    checkAuth,
};