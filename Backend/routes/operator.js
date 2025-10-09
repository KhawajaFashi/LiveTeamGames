import { Router } from 'express';
import {
    fetchOpeatorData,
    updateTeamName,
    deleteTeam
} from '../controllers/operator.js';

const router = Router();

router.get('/fetch_data', fetchOpeatorData);
router.post('/update_team_name', updateTeamName);
router.delete('/delete_team', deleteTeam);

export default router;