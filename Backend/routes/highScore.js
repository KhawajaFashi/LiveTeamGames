import { Router } from 'express';
import {
    fetchHighScoreData,
    saveHighScore,
    deletehighScore,
    addHighScore,
    editHighScore,
} from '../controllers/highScore.js';

const router = Router();

router.get('/fetch_data', fetchHighScoreData);
router.post('/save_high_score', saveHighScore);
router.delete('/delete_high_score', deletehighScore);
router.post('/add_high_score', addHighScore);
router.post('/edit_name', editHighScore);

export default router;