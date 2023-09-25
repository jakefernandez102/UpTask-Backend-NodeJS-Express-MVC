import nodemailer from 'nodemailer';

export const registerEmail = async ( data ) =>
{
    const { email, name, token } = data;

    const transport = nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    } );

    //informaion del email
    const info = await transport.sendMail( {
        from: '"UpTask - Projects Manager" <accounts@updatask.com>',
        to: email,
        subject: "UpTask - Confirm Account",
        text: "Verify your account in UpTask",
        html: `
            <p>Hello ${ name }, Verify your your account in UpTask</p>

            <p>Your Account is almost ready, just click on the following link:</p>
        
            <a href="${ process.env.FRONTEND_URL }/confirm/${ token }">Verify Account</a>

            <p>If you didn't create this account, you can ignore this message.</p>
        `
    } );
};

export const forgotPasswordEmail = async ( data ) =>
{
    const { email, name, token } = data;


    const transport = nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    } );

    //informaion del email
    const info = await transport.sendMail( {
        from: '"UpTask - Projects Manager" <accounts@updatask.com>',
        to: email,
        subject: "UpTask - Reset your Password",
        text: "Reset your Password",
        html: `
            <p>Hello ${ name }, You have quested to Reset your Password</p>

            <p>Follow link in order to generate a new password:</p>
        
            <a href="${ process.env.FRONTEND_URL }/forgot-password/${ token }">Reset Password</a>

            <p>If you didn't request to change your UpTask password, you can ignore this message.</p>
        `
    } );
};

