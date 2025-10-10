import { Router } from 'express';
import {
    handleUserLogin,
    handleUserLogout,
    handleUserSignup,
    verify_login,
    uploadData,
    fetchUserProfile
} from '../controllers/user.js';

const router = Router();

router.post('/signup', handleUserSignup);

router.post('/signin', handleUserLogin);

router.post('/logout', handleUserLogout);

router.post('/verify_login', verify_login);

router.post('/update_profile', uploadData);

router.get('/fetch_profile', fetchUserProfile);

export default router;