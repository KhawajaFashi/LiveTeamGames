import { Router } from 'express';
import {
    handleUserLogin,
    handleUserLogout,
    handleUserSignup,
    verify_login,
    uploadData,
    fetchUserProfile,
    uploadDataWithEmail
} from '../controllers/user.js';
import { getUserMedia, addUserMedia, deleteUserMedia } from '../controllers/user.js';

const router = Router();

router.post('/signup', handleUserSignup);

router.post('/signin', handleUserLogin);

router.post('/logout', handleUserLogout);

router.post('/verify_login', verify_login);

router.post('/update_profile', uploadData);

router.post('/update_profile_with_email', uploadDataWithEmail);

router.get('/fetch_profile', fetchUserProfile);

// Media endpoints
router.get('/media', getUserMedia);
router.post('/media', addUserMedia);
router.delete('/media', deleteUserMedia);

export default router;