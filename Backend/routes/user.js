import { Router } from 'express';
import { handleUserLogin, handleUserLogout, handleUserSignup, verify_login } from '../controllers/user.js';

const router = Router();

router.post('/signup', handleUserSignup);

router.post('/signin', handleUserLogin);

router.post('/logout', handleUserLogout);

router.post('/verify_login', verify_login);

export default router;