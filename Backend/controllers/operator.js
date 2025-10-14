import riddle from "../models/riddle.js";
import team from "../models/teams.js";

// Fetch operator data (teams) for a given gameName or route
export const fetchOpeatorData = async (req, res) => {
    try {
        const { gameName, routeId } = req.query || {};
        if (!gameName) return res.status(400).json({ success: false, message: 'gameName query parameter is required' });

        const query = { gameName };
        if (routeId) query.route = routeId;

        // populate riddles lightly if needed
        const teams = await team.find(query).populate({ path: "riddles.riddle" }).lean();
        console.log(teams);

        return res.status(200).json({ success: true, data: teams, message: 'Teams fetched' });
    } catch (error) {
        console.error('fetchOpeatorData error', error);
        return res.status(500).json({ success: false, message: 'Error fetching operator data', error: error.message });
    }
}

// Update team name by id
export const updateTeamName = async (req, res) => {
    try {
        const { _id, name } = req.body || {};
        if (!_id || !name) return res.status(400).json({ success: false, message: '_id and name are required' });

        console.log("Existing", _id, name);
        const existing = await team.findById(_id);
        if (!existing) return res.status(404).json({ success: false, message: 'Team not found' });

        existing.name = name;
        const saved = await existing.save();
        return res.status(200).json({ success: true, data: saved, message: 'Team name updated' });
    } catch (error) {
        console.error('updateTeamName error', error);
        return res.status(500).json({ success: false, message: 'Error updating team name', error: error.message });
    }
}

// Delete a team by id
export const deleteTeam = async (req, res) => {
    try {
        const payload = req.body || {};
        const teamId = payload._id || payload.teamId || req.query._id || req.query.teamId;
        if (!teamId) return res.status(400).json({ success: false, message: '_id (team id) is required' });

        const existing = await team.findById(teamId);
        if (!existing) return res.status(404).json({ success: false, message: 'Team not found' });

        await team.findByIdAndDelete(teamId);
        return res.status(200).json({ success: true, message: 'Team deleted', data: { deletedId: teamId } });
    } catch (error) {
        console.error('deleteTeam error', error);
        return res.status(500).json({ success: false, message: 'Error deleting team', error: error.message });
    }
}

// Temporary: add a new team (creates a minimal team document)
export const addTeam = async (req, res) => {
    try {
        const payload = req.body || {};
        const { name, gameName, route, phone } = payload;
        if (!name || !gameName) return res.status(400).json({ success: false, message: 'name and gameName are required' });

        const newTeam = new team({
            name,
            gameName,
            route: route || null,
            phone: phone || '',
            status: payload.status || 'PLAY',
            route: payload.route,
            timeLeft: payload.timeLeft || '',
            Battery: payload.Battery ?? payload.battery ?? 0,
            StartedAt: payload.StartedAt ?? Date.now(),
            playingTime: payload.playingTime ?? Date.now(),
            riddles: payload.riddles || [],
            coordinates: payload.coordinates || { type: 'Point', coordinates: [0, 0] },
            teamPics: payload.teamPics || [],
            teamVids: payload.teamVids || [],
        });
        const totalScore = payload.riddles.reduce((sum, r) => {
            // Only add score of solved riddles
            if (r.riddleStatus === "SOLVED") {
                return sum + (r.riddleScore || 0);
            }
            return sum;
        }, 0);
        newTeam.score = totalScore;

        const saved = await newTeam.save();
        console.log(saved);
        return res.status(201).json({ success: true, data: saved, message: 'Team created' });
    } catch (error) {
        console.error('addTeam error', error);
        return res.status(500).json({ success: false, message: 'Error creating team', error: error.message });
    }
}

// Update a team's riddle score (by riddle index) and recompute total score
export const updateTeamScore = async (req, res) => {
    try {
        const { _id, riddleIndex, riddleScore, riddleStatus, scoretype } = req.body || {};
        if (!_id || typeof riddleIndex === 'undefined' || typeof riddleScore === 'undefined') {
            return res.status(400).json({ success: false, message: '_id, riddleIndex and riddleScore are required' });
        }

        const existing = await team.findById(_id);
        const existingTeam = await team.findById(_id).populate({path:"riddles.riddle"}).lean();
        if (!existing) return res.status(404).json({ success: false, message: 'Team not found' });

        if (!existing.riddles || !existing.riddles[riddleIndex]) {
            return res.status(400).json({ success: false, message: 'Invalid riddleIndex' });
        }
        if (scoretype === 'add') {   
            existing.riddles[riddleIndex].riddleScore += Number(riddleScore);
            existingTeam.riddles[riddleIndex].riddleScore += Number(riddleScore);
        }
        else {
            existing.riddles[riddleIndex].riddleScore -= Number(riddleScore);
            existingTeam.riddles[riddleIndex].riddleScore -= Number(riddleScore);
        }
        if (typeof riddleStatus !== 'undefined') existing.riddles[riddleIndex].riddleStatus = riddleStatus;
        // recompute total score: sum only SOLVED riddleScore
        const totalScore = (existing.riddles || []).reduce((sum, r) => {
            if (r.riddleStatus === 'SOLVED') return sum + (r.riddleScore || 0);
            return sum;
        }, 0);
        existing.score = totalScore;
        existingTeam.score = totalScore;
        
        const saved = await existing.save();
        
        console.log(existingTeam)
        return res.status(200).json({ success: true, data: existingTeam, message: 'Team riddle score updated' });
    } catch (error) {
        console.error('updateTeamScore error', error);
        return res.status(500).json({ success: false, message: 'Error updating team riddle score', error: error.message });
    }
}

// Update team info like phone and playingTime
export const updateTeamInfo = async (req, res) => {
    try {
        const { _id, phone, playingTime } = req.body || {};
        if (!_id) return res.status(400).json({ success: false, message: '_id is required' });

        const existing = await team.findById(_id);
        if (!existing) return res.status(404).json({ success: false, message: 'Team not found' });

        if (typeof phone !== 'undefined') existing.phone = phone;
        if (typeof playingTime !== 'undefined') existing.playingTime = playingTime;

        const saved = await existing.save();
        return res.status(200).json({ success: true, data: saved, message: 'Team info updated' });
    } catch (error) {
        console.error('updateTeamInfo error', error);
        return res.status(500).json({ success: false, message: 'Error updating team info', error: error.message });
    }
}