import { Router } from 'express';
import {
    fetchGameData,
    addRoute,
    updateFavourite,
    updateStatus,
    updateSettings,
    updateGearSettings,
    updateRoute,
    updateRouteType,
    deleteRoute,
    deleteRiddle,
    addRiddle,
    editRiddleStructure,
    duplicateRoute
} from '../controllers/games.js';

const router = Router();

router.get('/fetch_data', fetchGameData);
router.post('/add_route', addRoute);
router.post('/update_favourite', updateFavourite);
router.post('/update_status', updateStatus);
router.post('/update_settings', updateSettings);
router.post('/update_gear_settings', updateGearSettings);
router.post('/update_route', updateRoute);
router.post('/update_route_type', updateRouteType);
router.delete('/delete_route', deleteRoute);
router.delete('/delete_riddle', deleteRiddle);
router.post('/add_riddle', addRiddle);
router.post('/edit_riddle_structure', editRiddleStructure);
router.post('/duplicate_route', duplicateRoute);

export default router;