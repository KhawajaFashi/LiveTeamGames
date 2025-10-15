import { Router } from 'express';
import {
    fetchHighScoreData,
    saveHighScore,
    deletehighScore,
    addHighScore,
    editHighScore,
    resetHighScore,
    saveHighScoreState,
} from '../controllers/highScore.js';

const router = Router();

router.get('/fetch_data', fetchHighScoreData);
router.post('/save_high_score', saveHighScore);
router.post('/save_saved_high_score', saveHighScoreState);
router.delete('/delete_high_score', deletehighScore);
router.post('/add_high_score', addHighScore);
router.post('/reset', resetHighScore);
router.post('/edit_name', editHighScore);

export default router;