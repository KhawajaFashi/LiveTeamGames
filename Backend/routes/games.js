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
    duplicateRoute,
    fetchRouteRiddles,
    editRiddle,
    fetchRouteSettings,
} from '../controllers/games.js';
import {
    addRouteTemplate,
    getRouteTemplates
} from '../controllers/GameRouteTemplate.js';

const router = Router();


router.get('/fetch_data', fetchGameData);
router.get('/fetch_route_riddles', fetchRouteRiddles);
router.get('/fetch_settings', fetchRouteSettings);
router.get('/get_template', getRouteTemplates);
router.post('/add_route', addRoute);
router.post('/edit_riddle', editRiddle);
router.post('/toggle_favourite', updateFavourite);
router.post('/toggle_status', updateStatus);
router.post('/update_settings', updateSettings);
router.post('/update_gear_settings', updateGearSettings);
router.post('/update_route', updateRoute);
router.post('/update_route_type', updateRouteType);
router.post('/add_riddle', addRiddle);
router.post('/add_template', addRouteTemplate);
router.post('/edit_riddle_structure', editRiddleStructure);
router.post('/duplicate_route', duplicateRoute);
router.delete('/delete_route', deleteRoute);
router.delete('/delete_riddle', deleteRiddle);

export default router;