import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';


const getProjects = async ( req, res ) =>
{
    const projects = await Project.find( {
        '$or': [
            { 'colaborators': { $in: req.user } },
            { 'creator': { $in: req.user } },
        ]
    } )
        .select( '-tasks' );
    res.json( projects );
};


const newProject = async ( req, res ) =>
{
    const project = new Project( req.body );
    project.creator = req.user._id;

    try
    {
        const savedProject = await project.save();
        res.json( savedProject );
    } catch ( error )
    {
        console.log( error );
    }
};


const getProject = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const project = await Project.findById( id )
            .populate( { path: 'tasks', populate: { path: 'completed', select: 'name' } } )
            .populate( "colaborators", "name email" );

        if ( !project )
        {
            const error = new Error( 'Project not found' );
            return res.status( 404 ).json( { msg: error.message } );
        }

        if ( project.creator.toString() !== req.user._id.toString() && !project.colaborators.some( collaborator => collaborator._id.toString() === req.user._id.toString() ) )
        {
            const error = new Error( 'Access Denied' );
            return res.status( 404 ).json( { msg: error.message } );
        }


        res.json( project );

    } catch ( error )
    {
        res.status( 404 ).json( { msg: 'Invalid Project ID' } );
    }


};


const editProject = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const project = await Project.findById( id );

        if ( !project )
        {
            const error = new Error( 'Project not found' );
            return res.status( 404 ).json( { msg: error.message } );
        }

        if ( project.creator.toString() !== req.user._id.toString() )
        {
            const error = new Error( 'Access Denied' );
            return res.status( 404 ).json( { msg: error.message } );
        }

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
        project.customer = req.body.customer || project.customer;

        const savedProject = await project.save();
        res.json( savedProject );

    } catch ( error )
    {
        res.status( 404 ).json( { msg: 'Invalid Project ID' } );
    }
};


const deleteProject = async ( req, res ) =>
{
    const { id } = req.params;

    const project = await Project.findById( id );

    if ( !project )
    {
        const error = new Error( 'Project not found' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Access Denied' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    try
    {
        await Project.deleteOne();
        res.json( { msg: 'Project deleted' } );
    } catch ( error )
    {
        console.log( error );
    }
};


const searchColaborator = async ( req, res ) =>
{
    const { email } = req.body;
    const user = await User.findOne( { email } ).select( '-confirmed -createdAt -password -token -updatedAt -__v' );

    if ( !user )
    {
        const error = new Error( 'User not found' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    res.json( user );
};

const addColaborator = async ( req, res ) =>
{
    const project = await Project.findById( req.params.id );

    if ( !project )
    {
        const error = new Error( 'Project not found' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Access denied!' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    const { email } = req.body;
    const user = await User.findOne( { email } ).select( '-confirmed -createdAt -password -token -updatedAt -__v' );

    if ( !user )
    {
        const error = new Error( 'User not found' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    //El colaborador no es el Admin del proyecto
    if ( project.creator.toString() === user._id.toString() )
    {
        const error = new Error( 'Project creator can not be a collaborator!' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    //revisar que no este agregado ya al proyecto
    if ( project?.colaborators?.includes( user._id ) )
    {
        const error = new Error( 'User is already added as collaborator!' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    //todo esta bien, se puede agregar
    project?.colaborators?.push( user._id );

    await project.save();
    res.json( { msg: 'Collaborator added successfully!' } );

};


const deleteColaborator = async ( req, res ) =>
{
    const project = await Project.findById( req.params.id );

    if ( !project )
    {
        const error = new Error( 'Project not found' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Access denied!' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    //todo esta bien, se puede eliminar
    project?.colaborators?.pull( req.body.id );

    await project.save();
    res.json( { msg: 'Collaborator deleted successfully!' } );
};





export
{
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchColaborator,
    addColaborator,
    deleteColaborator,
};