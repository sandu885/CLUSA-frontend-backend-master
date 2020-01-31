const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const keys = require('../../config/keys');

const sendEmail = async(emailAddress, username, password, type) => {
    try {
        console.log("send email request received.");
        if (!emailAddress)
            throw new Error("No email");
        console.log("Receiver email address is " + emailAddress);
        let options = {
            auth: {
                api_key: keys.sendGridKey,
            }
        }
        let client = nodemailer.createTransport(sgTransport(options));
        let mailContent = {
            from: {
             name: 'CLUSA',
             address: 'grant@clusa.org'
         },
            to: emailAddress,
            subject: type == 'signup' ? 'Confirmation of signup' : 'Confirmation of submitting the application',
            text: type == 'signup' ? `Dear ${username}, \n ${keys.signupText} 
                \n Below is your account information: \n username: ${username} \n password: ${password} 
                \n Best Regards, \n CLUSA`:
                    `Dear ${username}, \n ${keys.submitText} 
                    \n Best Regards, \n Qing Bai \n Director of Administration & Education \n Civic Leadership USA (CLUSA) \n 2655 Campus Drive, Suite 120 \n San Mateo, CA 94403 \n Phone: 408-2508436 \n Email: qbai@clusa.org
                    \n URL: www.clusa.org
                    \n Diverse in Leadership * Inclusive in Participation  
                    `,
            attachments: type == 'signup' ? null: [
                {   // utf-8 string as an attachment
                    filename: 'training_webinar_attendees_info.xlsx',
                    path: './templates/training_webinar_attendees_info.xlsx'
                }
            ]
        };
        await client.sendMail(mailContent);
        const message = 'Your message has been successfully sent.';
        console.log("Your message has been successfully sent.");
        return message;
    } catch(err) {
        console.log(err.message);
        throw new Error(err.message);
    }
}

module.exports = {
    sendEmail,
}