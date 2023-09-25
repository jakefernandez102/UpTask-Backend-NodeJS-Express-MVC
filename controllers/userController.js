import { forgotPasswordEmail, registerEmail } from '../helpers/email.js';
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import User from '../models/User.js';

const registerUser = async ( req, res ) =>
{
    //evitar registros duplicados
    const { email } = req.body;
    const userExists = await User.findOne( { email } );
    if ( userExists )
    {
        const error = new Error( 'User is already registered.' );
        return res.status( 400 ).json( { msg: error.message } );
    }
    try
    {
        const user = new User( req.body );
        user.token = generateId();
        const savedUser = await user.save();

        //enviar email de confirmacion
        registerEmail( {
            email: user.email,
            name: user.name,
            token: user.token
        } );

        res.json( { msg: 'User created successfully, review your email to confirm your account' } );
    } catch ( error )
    {
        console.log( error );
    }
};

const auth = async ( req, res ) =>
{
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const user = await User.findOne( { email } );
    if ( !user )
    {
        const error = new Error( 'User does not exist.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

    //comprobar que el usuario esta confirmado 
    if ( !user.confirmed )
    {
        const error = new Error( 'User is not confirmed yet, try to change your password to receive another confirmation link in you email.' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    //comprobar su password
    if ( await user.verifyPassword( password ) )
    {
        res.json( {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT( user._id )
        } );
    } else
    {
        const error = new Error( 'Invalid Password.' );
        return res.status( 403 ).json( { msg: error.message } );
    }
};

const verifyUser = async function ( req, res )
{
    const { token } = req.params;
    const verifiedUser = await User.findOne( { token } );

    if ( !verifiedUser )
    {
        const error = new Error( 'There was an error.' );
        return res.status( 403 ).json( { msg: error.message } );
    }

    try
    {
        verifiedUser.confirmed = true;
        verifiedUser.token = '';
        await verifiedUser.save();
        res.json( { msg: 'User verified successfully' } );
    } catch ( error )
    {
        console.log( error );
    }

    console.log( verifiedUser );
};

const resetPassword = async ( req, res ) =>
{
    const { email } = req.body;

    const user = await User.findOne( { email } );

    if ( user === null )
    {
        const error = new Error( 'User does not exist.' );
        console.log( error );
        return res.status( 404 ).json( { msg: error.message } );
    }

    try
    {
        user.token = generateId();
        await user.save();

        //enviar el email
        forgotPasswordEmail( {
            email: user.email,
            name: user.name,
            token: user.token
        } );

        res.json( { msg: 'We have sent an email with the instructions to reset your password.' } );
    } catch ( error )
    {
        console.log( error );
    }

};

const verifyToken = async ( req, res ) =>
{
    const { token } = req.params;

    const validToken = await User.findOne( { token } );

    if ( validToken )
    {
        res.json( { msg: 'Valid Token, user exists' } );
    } else
    {
        const error = new Error( 'Invalid Token.' );
        return res.status( 404 ).json( { msg: error.message } );
    }
};

const newPassword = async ( req, res ) =>
{
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne( { token } );

    if ( user )
    {
        user.password = password;
        user.token = '';

        try
        {
            await user.save();
            res.json( { msg: "New password has been changed successfuly" } );
        } catch ( error )
        {
            console.log( error );
        }

    } else
    {
        const error = new Error( 'Invalid Token.' );
        return res.status( 404 ).json( { msg: error.message } );
    }

};

const profile = async ( req, res ) =>
{
    const { user } = req;

    res.json( user );
};

export
{
    registerUser,
    auth,
    verifyUser,
    resetPassword,
    verifyToken,
    newPassword,
    profile
};