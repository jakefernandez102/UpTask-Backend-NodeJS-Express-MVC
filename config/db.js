import 'dotenv/config';

import mongoose from 'mongoose';

const connectDB = async () =>
{
    console.log( process.env.DB_URL );
    try
    {
        const connection = await mongoose.connect( `${ process.env.DB_URL }`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } );
        const url = `${ connection.connection.host }:${ connection.connection.port } `;
        console.log( `MongoDB Conectado en: ${ url }` );
    } catch ( error )
    {
        console.log( 'error: ', error.message );
        process.exit( 1 );
    }
};

export default connectDB;