import mongoose from "mongoose";
import highScore from "../models/highScore.js"
import route from "../models/route.js";
import team from "../models/teams.js";

export const fetchHighScoreData = async (req, res) => {
    try {
        const { gameName } = req.query;
        if (!gameName)
            return res.status(404).json({ success: false, message: "GameName is required" });

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


export const saveHighScore = async (req, res) => {

}
export const deletehighScore = async (req, res) => {

}
export const addHighScore = async (req, res) => {
    try {
        const {
            gameName,
            name,
            saved,
        } = req.body;

        // Create base route object
        const newHighScore = new highScore({
            name,
            gameName,
            saved,
        });

        // Save the route
        await newHighScore.save();
        console.log(newHighScore);


        res.status(201).json({
            success: true,
            data: newHighScore,
            message: "HighScore created successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating highScore",
            error: error.message
        });
    }
}
export const editHighScore = async (req, res) => {

}