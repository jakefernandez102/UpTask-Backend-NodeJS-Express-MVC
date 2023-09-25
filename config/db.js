import 'dotenv/config';

import mongoose from 'mongoose';

const connectDB = async () =>
{
    console.log( process.env.MONGO_URI );
    try
    {
        const connection = await mongoose.connect( `${ process.env.MONGO_URI }`, {
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