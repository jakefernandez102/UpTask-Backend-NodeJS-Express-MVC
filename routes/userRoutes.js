import express from 'express';

import
    {
        auth,
        newPassword,
        profile,
        registerUser,
        resetPassword,
        verifyToken,
        verifyUser,
    } from '../controllers/userController.js';
import checkAuth from './../middleware/checkAuth.js';


const router = express.Router();

//Autenticacion, registro y confirmacion de Usuarios
router.post( '/', registerUser );//crea un nuevo usuario
router.post( '/login', auth );
router.get( '/verify/:token', verifyUser );
router.post( '/forgot-password', resetPassword );
router.route( '/reset-password/:token' ).get( verifyToken ).post( newPassword );

router.get( '/profile', checkAuth, profile );


export default router;