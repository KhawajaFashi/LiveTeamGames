import mongoose from "mongoose";
import highScore from "../models/highScore.js"
import route from "../models/route.js";
import team from "../models/teams.js";

export const fetchHighScoreData = async (req, res) => {
    try {
        const { gameName } = req.query;
        if (!gameName)
            return res.status(404).json({ success: false, message: "GameName is required" });
        console.log("HighScore Data:", gameName);

        // Step 1: Fetch all highscores for the game
        const highscores = await highScore.find({ gameName });
        if (!highscores.length)
            return res.status(204).json({ success: false, message: "No Data Available" });

        const result = [];

        // Step 2: For each highscore, find its routes and related teams
        for (const hs of highscores) {
            const routes = await route.find({ highScore: hs._id });
            const allTeams = new Map(); // ✅ to ensure unique teams

            const routeData = [];
            for (const r of routes) {
                const teams = await team
                    .find({ route: r._id });

                // ✅ add teams uniquely using Map
                for (const t of teams) {
                    allTeams.set(t._id.toString(), t);
                }

                routeData.push({
                    route: r.name,
                    teams: teams
                });
            }

            result.push({
                highScore: hs,
                routes: routeData,
                teams: Array.from(allTeams.values()), // ✅ unique teams only
                teamCount: allTeams.size
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully fetched highScore Data",
            data: result
        });

    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};


export const resetHighScore = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Highscore ID is required"
            });
        }

        // Remove highscore reference from routes
        await route.updateMany(
            { highScore: _id },
            { $set: { highScore: null } }
        );

        // Update the highscore to indicate reset
        const updatedHighScore = await highScore.findByIdAndUpdate(
            _id,
            {
                $set: {
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedHighScore) {
            return res.status(404).json({
                success: false,
                message: "Highscore not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedHighScore,
            message: "Highscore reset successfully"
        });
    } catch (error) {
        console.error('Error resetting highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error resetting highscore",
            error: error.message
        });
    }
}

export const saveHighScore = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Highscore ID is required"
            });
        }

        // Find and update the highscore to saved=true
        const updatedHighScore = await highScore.findByIdAndUpdate(
            _id,
            {
                $set: {
                    saved: true,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedHighScore) {
            return res.status(404).json({
                success: false,
                message: "Highscore not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedHighScore,
            message: "Highscore saved successfully"
        });
    } catch (error) {
        console.error('Error saving highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error saving highscore",
            error: error.message
        });
    }
}
export const saveHighScoreState = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Highscore ID is required"
            });
        }

        // Find and update the highscore to saved=false
        const updatedHighScore = await highScore.findByIdAndUpdate(
            _id,
            {
                $set: {
                    saved: false,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedHighScore) {
            return res.status(404).json({
                success: false,
                message: "Highscore not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedHighScore,
            message: "Highscore saved successfully"
        });
    } catch (error) {
        console.error('Error saving highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error saving highscore",
            error: error.message
        });
    }
}
export const deletehighScore = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Highscore ID is required"
            });
        }

        // First, remove highscore reference from all routes
        await route.updateMany(
            { highScore: _id },
            { $set: { highScore: null } }
        );

        // Then delete the highscore
        const deletedHighScore = await highScore.findByIdAndDelete(_id);

        if (!deletedHighScore) {
            return res.status(404).json({
                success: false,
                message: "Highscore not found"
            });
        }

        res.status(200).json({
            success: true,
            data: deletedHighScore,
            message: "Highscore and references deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting highscore",
            error: error.message
        });
    }
}
export const addHighScore = async (req, res) => {
    try {
        const { gameName, name, saved = false } = req.body;

        // Validate required fields
        if (!gameName) {
            return res.status(400).json({
                success: false,
                message: "Game name is required"
            });
        }
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Highscore name is required"
            });
        }

        // Create highscore with timestamps
        const newHighScore = new highScore({
            name: name.trim(),
            gameName,
            saved,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save the highscore
        await newHighScore.save();

        res.status(201).json({
            success: true,
            data: newHighScore,
            message: "Highscore created successfully"
        });
    } catch (error) {
        console.error('Error creating highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error creating highscore",
            error: error.message
        });
    }
}
export const editHighScore = async (req, res) => {
    try {
        const { _id, name, saved } = req.body;

        // Validate required fields
        console.log("Edit HighScore payload:", req.body);
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Highscore ID is required"
            });
        }
        console.log("Edit HighScore _id:", _id);

        // Find the highscore
        const existingHighScore = await highScore.findById(_id);
        if (!existingHighScore) {
            return res.status(404).json({
                success: false,
                message: "Highscore not found"
            });
        }
        console.log("Edit HighScore existing:", existingHighScore);

        // Update the highscore with new values
        const updatedHighScore = await highScore.findByIdAndUpdate(
            _id,
            { $set: { name: name } },
            { new: true } // return updated document
        );
        console.log("Updated HighScore:", updatedHighScore);

        res.status(200).json({
            success: true,
            data: updatedHighScore,
            message: "Highscore updated successfully"
        });
    } catch (error) {
        console.error('Error updating highscore:', error);
        res.status(500).json({
            success: false,
            message: "Error updating highscore",
            error: error.message
        });
    }
}