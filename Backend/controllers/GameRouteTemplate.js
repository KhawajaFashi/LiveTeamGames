import routeTemplate from '../models/GameRouteTemplate.js';

export const addRouteTemplate = async (req, res) => {
    try {
        const {
            id,
            gameName,
            name,
            description,
            riddles
        } = req.body;

        // Create new route template
        const newRouteTemplate = new routeTemplate({
            id,
            gameName,
            name,
            description,
            riddles: riddles || [] // Initialize empty array if no riddles provided
        });

        // Save the route template
        const savedTemplate = await newRouteTemplate.save();

        // Populate the riddles reference before sending response
        const populatedTemplate = await savedTemplate.populate('riddles');

        res.status(201).json({
            success: true,
            data: populatedTemplate,
            message: "Route template created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating route template",
            error: error.message
        });
    }
}

export const getRouteTemplates = async (req, res) => {
    try {
        const gameName = req.query?.gameName;
        console.log("Fetching templates for game:", req.query?.gameName);
        if (!gameName) {
            return res.status(400).json({
                success: false,
                message: "gameName query parameter is required"
            });
        }
        const templates = await routeTemplate.find({ gameName }).populate('riddles');
        console.log(templates);
        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching route templates",
            error: error.message
        });
    }
}