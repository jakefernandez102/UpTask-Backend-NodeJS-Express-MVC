// const expres = require( 'express' );
import expres from 'express';

import connectDB from './config/db.js';

const app = expres();
connectDB();

const PORT = process.env.PORT || 4000;

app.listen( PORT, () =>
{
    console.log( `Servidor corriendo en el puerto ${ [ PORT ] }` );
} );

