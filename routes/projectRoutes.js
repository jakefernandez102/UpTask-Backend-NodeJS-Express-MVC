import express from 'express';

import
{
    addColaborator,
    deleteColaborator,
    deleteProject,
    editProject,
    getProject,
    getProjects,
    newProject,
    searchColaborator,
} from '../controllers/projectController.js';
import checkAuth from './../middleware/checkAuth.js';

const router = express.Router();

router.route( '/' ).get( checkAuth, getProjects ).post( checkAuth, newProject );

router.route( '/:id' )
    .get( checkAuth, getProject )
    .put( checkAuth, editProject )
    .delete( checkAuth, deleteProject );

router.post( '/collaborators', checkAuth, searchColaborator );
router.post( '/collaborators/:id', checkAuth, addColaborator );
router.post( '/delete-collaborator/:id', checkAuth, deleteColaborator );

export default router;