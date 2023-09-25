import Project from '../models/Project.js';
import Task from '../models/Task.js';


const addTask = async ( req, res ) =>
{
    const { project } = req.body;

    const projectExists = await Project.findById( project );


    if ( !project )
    {
        const error = new Error( 'Project does not exist.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( projectExists.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Access Denied to add tasks.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    try
    {
        const savedTask = await Task.create( req.body );
        //Almacenar ID en el proyecto
        projectExists.tasks.push( savedTask._id );
        await projectExists.save();
        res.json( savedTask );
    } catch ( error )
    {
        console.log( error );
    }
};


const getTask = async ( req, res ) =>
{
    const { id } = req.params;

    const task = await Task.findById( id ).populate( "project" );

    if ( !task )
    {
        const error = new Error( 'Task not found.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( task.project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Invalid Accion.' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    res.json( task );
};


const updateTask = async ( req, res ) =>
{
    const { id } = req.params;

    const task = await Task.findById( id ).populate( "project" );

    if ( !task )
    {
        const error = new Error( 'Task not found.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( task.project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Invalid Accion.' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

    try
    {
        const savedTask = await task.save();
        return res.json( savedTask );
    } catch ( error )
    {
        console.log( error );
    }
};


const deleteTask = async ( req, res ) =>
{
    const { id } = req.params;

    const task = await Task.findById( id ).populate( "project" );

    if ( !task )
    {
        const error = new Error( 'Task not found.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( task.project.creator.toString() !== req.user._id.toString() )
    {
        const error = new Error( 'Invalid Accion.' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    try
    {
        const project = await Project.findById( task.project );
        project.tasks.pull( task._id );
        await Promise.allSettled( [await project.save(), await task.deleteOne()] );
        res.json( { msg: "Task deleted successfully" } );
    } catch ( error )
    {
        console.log( error );
    }
};


const changeStatusTask = async ( req, res ) =>
{
    const { id } = req.params;

    const task = await Task.findById( id )
        .populate( "project" );

    if ( !task )
    {
        const error = new Error( 'Task not found.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    if ( task.project.creator.toString() !== req.user._id.toString() && !task.project.colaborators.some( colaborator => colaborator._id.toString() === req.user._id.toString() ) )
    {
        const error = new Error( 'Invalid Accion.' );
        return res.status( 403 ).json( { msg: error.message } );
    }
    task.status = !task.status;
    task.completed = req.user._id;
    task.save();

    const savedTask = await Task.findById( id )
        .populate( "project" )
        .populate( 'completed' );

    res.json( savedTask );


};


export
{
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatusTask,
};