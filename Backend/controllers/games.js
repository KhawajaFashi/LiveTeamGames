import route from "../models/route.js";
import riddle from "../models/riddle.js";
// Fetch all riddles for a given route name
export const fetchRouteRiddles = async (req, res) => {
    try {
        const { routeName } = req.query;
        console.log("Found route:", routeName);
        if (!routeName) {
            return res.status(400).json({
                success: false,
                message: "routeName query parameter is required"
            });
        }
        const foundRoute = await route.findOne({ routeName }).populate('riddles');

        if (!foundRoute) {
            return res.status(404).json({
                success: false,
                message: "Route not found",
            });
        }

        const riddlesList = foundRoute.riddle || [];

        res.status(200).json({
            success: true,
            data: riddlesList,
            message: "Riddles fetched successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching riddles",
            error: error.message
        });
    }
}

export const fetchGameData = async (req, res) => {
    try {
        const { gameName } = req.query;
        if (!gameName) {
            return res.status(400).json({
                success: false,
                message: "gameName query parameter is required"
            });
        }
        const routes = await route.find({ gameName });
        res.status(200).json({
            success: true,
            data: routes,
            message: "Routes fetched successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching routes",
            error: error.message
        });
    }
}

export const addRoute = async (req, res) => {
    try {
        const {
            gameName,
            name,
            playingTime,
            templateId,
            routeType,
            shareCode,
            description,
            riddles,
            lang = "EN"  // Default language
        } = req.body;

        // Generate random admin and cheat codes
        const adminCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const cheatCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create base route object
        const newRoute = new route({
            name,
            gameName,
            playingTime,
            lang,
            active: false,
            favourite: false,
            adminCode,
            cheatCode,
            numberOfItems: riddles ? riddles.length : 0,

            // Default settings
            general: {
                backgroundMusic: { defaultStatus: "active", path: "" },
                gameLogo: { defaultStatus: "active", path: "" },
                welcomeBackground: { defaultStatus: "active", path: "" },
                helpBackground: { defaultStatus: "active", path: "" },
                itemIcon: { defaultStatus: "active", path: "" },
                scoreIcon: { defaultStatus: "active", path: "" }
            },
            map: {
                mapStyle: { defaultStatus: "active", path: "" },
                mapQuestMarker: { defaultStatus: "active", path: "" },
                mapTeamMarker: { defaultStatus: "active", path: "" },
                finalLocationMarker: { defaultStatus: "active", path: "" },
                mapLoader: { defaultStatus: "active", path: "" },
                mapHelping: [],
                gearSettings: {
                    startText: "",
                    endText: "",
                    endLocation: {
                        active: false,
                        name: "",
                        coordinates: {
                            lat: 0,
                            lng: 0
                        }
                    }
                }
            }
        });

        // If riddles are provided (template route), associate them
        if (riddles && Array.isArray(riddles)) {
            // Find all riddles and validate they exist
            const riddleObjects = await Promise.all(
                riddles.map(async (riddleId) => {
                    const riddleObj = await riddle.findById(riddleId);
                    if (!riddleObj) {
                        throw new Error(`Riddle with ID ${riddleId} not found`);
                    }
                    return riddleObj;
                })
            );

            // Associate first riddle as the starting point
            if (riddleObjects.length > 0) {
                newRoute.riddle = riddleObjects;
            }
        }

        // Save the route
        await newRoute.save();
        console.log(newRoute);


        res.status(201).json({
            success: true,
            data: newRoute,
            message: "Route created successfully",
            adminCode: adminCode,  // Return the admin code for display
            cheatCode: cheatCode   // Return the cheat code for display
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating route",
            error: error.message
        });
    }
}
export const updateFavourite = async (req, res) => {

}
export const updateStatus = async (req, res) => {

}
export const updateSettings = async (req, res) => {

}
export const updateGearSettings = async (req, res) => {

}
export const updateRoute = async (req, res) => {

}
export const updateRouteType = async (req, res) => {

}
export const deleteRoute = async (req, res) => {

}
export const deleteRiddle = async (req, res) => {

}
export const addRiddle = async (req, res) => {
    try {
        const {
            gameName,
            name,
            episode,
            type,
            category,
            routeName,
            coordinates,
            radius,
            picture,
            description,
            solutions,
            hint,
            maxScore,
            tries,
            deductionPercent,
            allowedAttempts,
            allowedTime,
            metaData,
            helpImage,
            conditionalExitPoint,
            accessConditionType,
            accessConditionAmount,
            arImageTarget
        } = req.body;

        const newRiddle = new riddle({
            gameName,
            name,
            episode,
            type,
            category,
            routeName,
            coordinates: {
                type: "Point",
                coordinates: coordinates
            },
            radius,
            picture,
            description,
            solutions,
            hint,
            maxScore,
            tries,
            deductionPercent,
            allowedAttempts,
            allowedTime,
            metaData,
            helpImage,
            conditionalExitPoint,
            accessConditionType,
            accessConditionAmount,
            arImageTarget
        });

        // The pre-save hook will automatically set default values based on type and category
        const savedRiddle = await newRiddle.save();

        res.status(201).json({
            success: true,
            data: savedRiddle,
            message: "Riddle created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating riddle",
            error: error.message
        });
    }
}
export const editRiddleStructure = async (req, res) => {

}
export const duplicateRoute = async (req, res) => {

}
