var nodemailer = require('nodemailer');
var http = require('http');
var url = require('url');
const e = require('cors');

const fs = require('fs');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);




var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


const sendUsingMailTrap = async (mailOptions : any) => {
    transporter.sendMail(mailOptions, function(error : any, info :any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
const sendWelcomeMail = async (params : any) => {
    var mailOptions = {
        from: process.env.SMTP_SENDER,
        to: params.email,
        subject: 'Hello '+ params.firstName+', Welcome to our platform',
        html: await readFile('src/constants/new_user_email.html', 'utf8')
        
    }
    
    sendUsingMailTrap(mailOptions);
}

const newLoginDetected = async (params : any) => {
    var mailOptions = {
        from:'mailtrap@demomailtrap.com',
        to: params.email,
        subject: 'Hello '+ params.firstName+', New login detected on your account',
        html: '<html> <h2> Hello,</h2> We have noticed that your account was accessed.<br> If that was not you, then please contact customer support or reset your password</html>'   
    }

    sendUsingMailTrap(mailOptions);

}

export default {
    sendWelcomeMail,
    newLoginDetected
}