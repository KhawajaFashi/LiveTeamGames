import { Router } from 'express';
import {
    fetchOpeatorData,
    updateTeamName,
    deleteTeam,
    addTeam
} from '../controllers/operator.js';
import { updateTeamScore, updateTeamInfo } from '../controllers/operator.js';

const router = Router();

router.get('/fetch_data', fetchOpeatorData);
router.post('/update_team_name', updateTeamName);
router.post('/add_team', addTeam);
router.post('/update_team_score', updateTeamScore);
router.post('/update_team_info', updateTeamInfo);
router.delete('/delete_team', deleteTeam);

export default router;