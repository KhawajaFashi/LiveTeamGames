import route from "../models/route.js";
import riddle from "../models/riddle.js";
import { RIDDLE_DEFAULTS } from "../config/riddleDefaults.js";
// Fetch all riddles for a given route name
export const fetchRouteRiddles = async (req, res) => {
    try {
        const { routeName } = req.query;
        if (!routeName) {
            return res.status(400).json({
                success: false,
                message: "routeName query parameter is required"
            });
        }
        const foundRoute = await route.findOne({ name: routeName }).populate('riddle');

        if (!foundRoute) {
            return res.status(404).json({
                success: false,
                message: "Route not found",
            });
        }
        // console.log("Found route with riddles:", foundRoute);

        const riddlesList = foundRoute.riddle || [];
        // console.log("Found route:", riddlesList);

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
            whiteLabel: "",
            numberOfItems: riddles ? riddles.length : 0,

            // Default settings
            general: {
                backgroundMusic: { defaultStatus: true, path: "" },
                gameLogo: { defaultStatus: true, path: "" },
                welcomeBackground: { defaultStatus: true, path: "" },
                helpBackground: { defaultStatus: true, path: "" },
                itemIcon: { defaultStatus: true, path: "" },
                scoreIcon: { defaultStatus: true, path: "" }
            },
            map: {
                mapStyle: { defaultStatus: true, path: "" },
                mapQuestMarker: { defaultStatus: true, path: "" },
                mapTeamMarker: { defaultStatus: true, path: "" },
                finalLocationMarker: { defaultStatus: true, path: "" },
                mapLoader: { defaultStatus: true, path: "" },
                mapHelping: [],
            },

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
                },
                arVideoTutorial: "",
                introVideo: "",
                outroWinVideo: "",
                outroLoseVideo: "",
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
    try {
        const { routeId } = req.body;
        if (!routeId) {
            return res.status(400).json({ success: false, message: 'routeId is required' });
        }

        // Find the route by routeId
        const existing = await route.findById(routeId);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }
        // Toggle the favourite field
        existing.favourite = !existing.favourite;
        const updated = await existing.save();
        console.log("Updated favourite status:", updated);

        return res.status(200).json({ success: true, data: updated, message: 'Favourite status updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating favourite', error: error.message });
    }

}
export const updateStatus = async (req, res) => {
    try {
        const { routeId } = req.body;
        if (!routeId) {
            return res.status(400).json({ success: false, message: 'routeId is required' });
        }

        // Find the route by routeId
        const existing = await route.findById(routeId);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }
        // Toggle the active field
        existing.active = !existing.active;
        const updated = await existing.save();
        console.log("Updated active status:", updated);

        return res.status(200).json({ success: true, data: updated, message: 'active status updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating active', error: error.message });
    }
}
export const updateSettings = async (req, res) => {

}
export const updateGearSettings = async (req, res) => {
    try {
        const payload = req.body || {};
        const { _id, routeID, name, gearSettings } = payload;

        if (!gearSettings || typeof gearSettings !== 'object') {
            return res.status(400).json({ success: false, message: 'gearSettings object is required' });
        }

        // Find existing route by _id or by name/routeID
        let existing = null;
        if (_id) existing = await route.findById(_id);
        else if (routeID) existing = await route.findOne({ name: routeID });
        else if (name) existing = await route.findOne({ name });

        if (!existing) return res.status(404).json({ success: false, message: 'Route not found' });
        console.log("Existing route before gearSettings update:", existing);
        // Merge gearSettings into existing route. Prefer nested map.gearSettings if present.
        if (existing?.gearSettings && typeof existing?.gearSettings === 'object') {
            existing.gearSettings = { ...(existing?.gearSettings || {}), ...gearSettings };
        } else {
            existing.gearSettings = { ...(existing.gearSettings || {}), ...gearSettings };
        }

        const saved = await existing.save();
        console.log("Existing route before gearSettings update:", saved);
        return res.status(200).json({ success: true, data: saved, message: 'Gear settings updated' });
    } catch (error) {
        console.error('updateGearSettings error', error);
        return res.status(500).json({ success: false, message: 'Error updating gear settings', error: error.message });
    }
}
export const updateRoute = async (req, res) => {
    try {
        const payload = req.body || {};
        const { _id, routeID, name } = payload;

        // console.log(payload);

        // Find existing route by _id or by name/routeID
        let existing = null;
        if (_id) existing = await route.findById(_id);
        else if (routeID) existing = await route.findOne({ name: routeID });
        else if (name) existing = await route.findOne({ name });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }

        // Allowed top-level updatable fields
        const updatable = ['name', 'playingTime', 'numberOfItems', 'highScore', 'cheatCode', 'adminCode', 'lang', 'active', 'favourite', 'description', 'whiteLabel'];

        updatable.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                let val = payload[key];
                // normalize numbers
                if (['numberOfItems'].includes(key) && val !== undefined && val !== null && val !== '') val = Number(val);
                existing[key] = val;
            }
        });

        console.log(updatable, payload);

        // Merge nested objects if provided
        if (payload.general && typeof payload.general === 'object') {
            existing.general = { ...(existing.general || {}), ...payload.general };
        }

        if (payload.map && typeof payload.map === 'object') {
            existing.map = { ...(existing.map || {}), ...payload.map };
        }

        if (payload.gearSettings && typeof payload.gearSettings === 'object') {
            // gearSettings typically lives under existing.map.gearSettings; accept both shapes
            if (existing.map && typeof existing.map === 'object') {
                existing.map.gearSettings = { ...(existing.map.gearSettings || {}), ...payload.gearSettings };
            } else {
                existing.gearSettings = { ...(existing.gearSettings || {}), ...payload.gearSettings };
            }
        }

        // Replace riddles association if provided (array of ids)
        if (Array.isArray(payload.riddles)) {
            existing.riddle = payload.riddles;
            existing.numberOfItems = payload.riddles.length;
        }

        const saved = await existing.save();
        return res.status(200).json({ success: true, data: saved, message: 'Route updated' });
    } catch (error) {
        console.error('updateRoute error', error);
        return res.status(500).json({ success: false, message: 'Error updating route', error: error.message });
    }
}

export const fetchRouteSettings = async (req, res) => {
    try {
        const { routeName, _id } = req.query || {};
        if (!routeName && !_id) return res.status(400).json({ success: false, message: 'routeName or _id query parameter is required' });

        let found = null;
        if (_id) found = await route.findById(_id).lean();
        else found = await route.findOne({ name: routeName }).lean();

        if (!found) return res.status(404).json({ success: false, message: 'Route not found' });
        console.log("\n\n\n\n\nfound", found.highScore);
        // return only the settings sections that the front-end cares about
        const settings = {
            name: found.name,
            playingTime: found.playingTime,
            numberOfItems: found.numberOfItems,
            cheatCode: found.cheatCode,
            adminCode: found.adminCode,
            highScore: found.highScore,
            whiteLabel: found.whiteLabel || { defaultStatus: false, path: "" },
            lang: found.lang,
            general: found.general || {},
            map: found.map || {},
        };

        return res.status(200).json({ success: true, data: settings, message: 'Route settings fetched' });
    } catch (error) {
        console.error('fetchRouteSettings error', error);
        return res.status(500).json({ success: false, message: 'Error fetching route settings', error: error.message });
    }
}
export const deleteRoute = async (req, res) => {
    try {
        const payload = req.body || {};
        const routeId = payload._id || payload.routeId || req.query._id || req.query.routeId || payload.id;

        if (!routeId) {
            return res.status(400).json({ success: false, message: '_id (route id) is required' });
        }

        const existingRoute = await route.findById(routeId);
        if (!existingRoute) return res.status(404).json({ success: false, message: 'Route not found' });

        const riddlesCount = Array.isArray(existingRoute.riddle) ? existingRoute.riddle.length : 0;

        // Delete the route document
        await route.findByIdAndDelete(routeId);

        return res.status(200).json({ success: true, message: 'Route deleted', data: { deletedId: routeId, riddlesDetached: riddlesCount } });
    } catch (error) {
        console.error('deleteRoute error', error);
        return res.status(500).json({ success: false, message: 'Error deleting route', error: error.message });
    }
}
export const deleteRiddle = async (req, res) => {
    try {
        // Accept riddle id from body or query
        const payload = req.body || {};
        const riddleId = payload._id || payload.riddleId || req.query._id || req.query.riddleId;

        if (!riddleId) {
            return res.status(400).json({ success: false, message: '_id (riddle id) is required' });
        }

        // Find the riddle
        const existing = await riddle.findById(riddleId);
        if (!existing) return res.status(404).json({ success: false, message: 'Riddle not found' });

        // Remove references from any routes that include this riddle
        const parentRoutes = await route.find({ riddle: riddleId });
        for (const pr of parentRoutes) {
            pr.riddle = (pr.riddle || []).filter(id => String(id) !== String(riddleId));
            pr.numberOfItems = Array.isArray(pr.riddle) ? pr.riddle.length : 0;
            await pr.save();
        }

        // Delete the riddle document
        await riddle.findByIdAndDelete(riddleId);

        return res.status(200).json({ success: true, message: 'Riddle deleted', data: { deletedId: riddleId, routesUpdated: parentRoutes.length } });
    } catch (error) {
        console.error('deleteRiddle error', error);
        return res.status(500).json({ success: false, message: 'Error deleting riddle', error: error.message });
    }
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
            description = "Solve this exciting riddle!",
            solutions = [],
            hint = "",
            maxScore = 1000,
            tries = 1,
            deductionPercent = 10,
            allowedAttempts = 3,
            allowedTime,
            metaData = "",
            helpImage = "",
            conditionalExitPoint = false,
            accessConditionType = "none",
            accessConditionAmount = 0,
            arImageTarget = ""
        } = req.body;

        // Validate required fields
        if (!name || !type || !category || !routeName || !coordinates || !radius) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, type, category, routeName, coordinates, and radius are required"
            });
        }

        // Find the route where we want to add the riddle
        const existingRoute = await route.findOne({ name: routeName });
        if (!existingRoute) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }

        // Build riddle object matching the schema
        const riddlePayload = {
            gameName: gameName || existingRoute.gameName,
            name,
            episode: episode ? Number(episode) : 1,
            type,
            category,
            coordinates: {
                type: "Point",
                // Ensure coordinates are numbers and in [lng, lat] order if provided as strings
                coordinates: Array.isArray(coordinates) ? coordinates.map(Number) : [Number(coordinates)]
            },
            radius: Number(radius),
            piture: picture || "",
            description,
            solutions: Array.isArray(solutions) ? solutions : (solutions ? [solutions] : []),
            hint: hint || "",
            maxScore: Number(maxScore),
            tries: Number(tries),
            deductionPercent: Number(deductionPercent),
            allowedAttempts: Number(allowedAttempts),
            allowedTime: allowedTime ? Number(allowedTime) : undefined,
            metaData: metaData || "",
            helpImage: helpImage || "",
            conditionalExitPoint: Boolean(conditionalExitPoint),
            accessConditionType: accessConditionType || "",
            accessConditionAmount: String(accessConditionAmount || "0"),
            arImageTarget: arImageTarget || ""
        };

        // Create and save the riddle
        const newRiddle = new riddle(riddlePayload);
        const savedRiddle = await newRiddle.save();

        // Associate the riddle with the route
        existingRoute.riddle = existingRoute.riddle || [];
        existingRoute.riddle.push(savedRiddle._id);
        existingRoute.numberOfItems = existingRoute.riddle.length;
        await existingRoute.save();

        const allRiddles = await riddle.find({ _id: { $in: existingRoute.riddle } });
        // console.log("All riddles for the route after addition:", allRiddles);

        // Return success response
        return res.status(201).json({
            success: true,
            data: allRiddles,
            message: "Riddle created and associated with route successfully"
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
    try {
        const { _id, name, type, category, updateTexts, keepTextContents } = req.body;
        if (!_id) return res.status(400).json({ success: false, message: '_id is required' });

        const existing = await riddle.findById(_id);
        if (!existing) return res.status(404).json({ success: false, message: 'Riddle not found' });

        // Update basic structural fields
        if (typeof name === 'string') existing.name = name;
        if (typeof type === 'string') existing.type = type;
        if (typeof category === 'string') existing.category = category;

        // If type/category changed, apply sane defaults from RIDDLE_DEFAULTS
        if (type) {
            const defaultsForType = RIDDLE_DEFAULTS[type];
            if (defaultsForType) {
                const defaultsForCategory = defaultsForType[category] || defaultsForType['default'];
                if (defaultsForCategory) {
                    if (defaultsForCategory.radius !== undefined) existing.radius = defaultsForCategory.radius;
                    if (defaultsForCategory.allowedTime !== undefined) existing.allowedTime = defaultsForCategory.allowedTime;
                    if (defaultsForCategory.deductionPercent !== undefined) existing.deductionPercent = defaultsForCategory.deductionPercent;
                }
            }
        }

        // Optionally the frontend may send flags about updating textual content; keep them but do not alter other fields here.
        // Save and return updated riddle
        const saved = await existing.save();
        return res.status(200).json({ success: true, data: saved, message: 'Riddle structure updated' });
    } catch (error) {
        console.error('editRiddleStructure error', error);
        return res.status(500).json({ success: false, message: 'Error updating riddle structure', error: error.message });
    }
}

export const editRiddle = async (req, res) => {
    try {
        const payload = req.body;
        const { _id } = payload;
        if (!_id) {
            return res.status(400).json({ success: false, message: '_id is required' });
        }

        // Find existing riddle
        const existing = await riddle.findById(_id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Riddle not found' });
        }

        // Prepare update fields - only update provided fields
        const updatable = [
            'gameName', 'name', 'episode', 'coordinates', 'radius', 'description', 'piture', 'picture', 'solutions', 'hint', 'maxScore', 'tries', 'deductionPercent', 'allowedAttempts', 'allowedTime', 'metaData', 'helpImage', 'conditionalExitPoint', 'accessConditionType', 'accessConditionAmount', 'arImageTarget'
        ];

        updatable.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                let value = payload[key];
                console.log("Payload for updating riddle:", value, payload[key]);
                // normalize numbers
                if (['episode', 'radius', 'maxScore', 'tries', 'deductionPercent', 'allowedAttempts', 'allowedTime'].includes(key) && value !== undefined && value !== null && value !== '') {
                    value = Number(value);
                }
                // coordinates may be an array of strings/numbers
                if (key === 'coordinates' && Array.isArray(value)) {
                    value = { type: 'Point', coordinates: value.map(Number) };
                }
                existing[key] = value;
            }
        });

        const saved = await existing.save();
        console.log("Updated riddle:", saved);
        return res.status(200).json({ success: true, data: saved, message: 'Riddle updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating riddle', error: error.message });
    }
}
export const duplicateRoute = async (req, res) => {
    try {
        const payload = req.body || {};
        const routeId = payload._id || payload.routeId || payload.id || req.query._id || req.query.routeId;

        if (!routeId) return res.status(400).json({ success: false, message: '_id (route id) is required' });

        const existing = await route.findById(routeId).lean();
        if (!existing) return res.status(404).json({ success: false, message: 'Route not found' });

        // Prepare clone data
        const clone = { ...existing };
        // Remove mongoose-specific and identifying fields
        delete clone._id;
        delete clone.__v;
        delete clone.createdAt;
        delete clone.updatedAt;

        // Generate a unique name: try "<name> duplicate", then "<name> duplicate 2", etc.
        const baseSuffix = ' duplicate';
        let candidateName = `${existing.name}${baseSuffix}`;
        let counter = 1;
        while (await route.findOne({ name: candidateName })) {
            counter += 1;
            candidateName = `${existing.name}${baseSuffix} ${counter}`;
        }
        clone.name = candidateName;

        // Generate new admin and cheat codes
        clone.adminCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        clone.cheatCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Ensure booleans/defaults are set for new clone
        clone.active = false;
        clone.favourite = false;

        // Use the route model to create and save (so middleware and defaults apply)
        const newRoute = new route(clone);
        const saved = await newRoute.save();

        return res.status(201).json({ success: true, data: saved, message: 'Route duplicated' });
    } catch (error) {
        console.error('duplicateRoute error', error);
        return res.status(500).json({ success: false, message: 'Error duplicating route', error: error.message });
    }
}
