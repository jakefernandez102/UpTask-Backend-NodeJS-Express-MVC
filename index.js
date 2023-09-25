// const expres = require( 'express' );
import expres from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = expres();
app.use( expres.json() );
connectDB();

//config cors
//*White list */
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function ( origin, callback )
    {
        if ( whitelist.includes( origin ) )
        {
            //puede consultar la API
            callback( null, true );
        } else
        {
            //No puede consultar la API
            callback( new Error( 'Cors Error by me' ) );
        }
    }
};

app.use( cors( corsOptions ) );

//Routing
app.use( '/api/users', userRoutes );
app.use( '/api/projects', projectRoutes );
app.use( '/api/tasks', taskRoutes );


const PORT = process.env.PORT || 4000;

const server = app.listen( PORT, () =>
{
    console.log( `Servidor corriendo en el puerto ${ [PORT] }` );
} );


// socket io
import { Server, Socket } from 'socket.io';

const io = new Server( server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
} );

io.on( 'connection', ( socket ) =>
{
    // console.log( 'conectado a socket.io' );

    //define socket io events
    socket.on( 'open project', ( projectId ) =>
    {
        socket.join( projectId );
    } );

    socket.on( 'new task', task =>
    {
        const project = task.project;
        socket.to( project ).emit( 'added task', task );
    } );

    socket.on( "delete task", task =>
    {
        const project = task?.project;
        socket.to( project ).emit( 'deleted task', task );
    } );
    socket.on( "update task", task =>
    {
        const project = task?.project?._id;
        socket.to( project ).emit( 'updated task', task );
    } );
    socket.on( "change status", task =>
    {
        const project = task?.project?._id;
        socket.to( project ).emit( 'new status', task );
    } );

} );