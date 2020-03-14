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

const sendUserAddEmail = async(emailAddress, username, token) => {
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
    const linkGeneration  = `<a href='http://18.144.133.201/forget-password?token=${token}'>click here. </a>`;
    let client = nodemailer.createTransport(sgTransport(options));
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: emailAddress,
      subject: 'Confirmation of signup',
      html: `Dear ${username}, <br > ${keys.signupText} 
                <br > Below is your account information: <br > username: ${username} <br > Set Password Link: ${linkGeneration}
                <br > Best Regards, <br > CLUSA`,
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

const forgetPassword = async(emailAddress, username, token, originLocation) => {
  try {
    if (!emailAddress)
      throw new Error("No email");
    let options = {
      auth: {
        api_key: keys.sendGridKey,
      }
    }
    let client = nodemailer.createTransport(sgTransport(options));
    const linkGeneration  = `<a href='${originLocation}/forget-password?token=${token}'>click here. </a>`
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: emailAddress,
      subject: 'Reset password request',
      html: `Dear ${username}, \n<br /> 
                \n<br /> We got your request that forgot your password, please click the link below to reset your password \n
                \n<br /> Below is your account information: <br />\n username: ${username} \n
                \n<br /> This is your reset password link ${linkGeneration} \n
                \n<br /> To reset password \n<br /> 
                \n<br /> Best Regards, \n<br /> CLUSA`,
      attachments: null
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

const sendRecreateLoginEmail = async(emailAddress, note) => {
  try {
    console.log("send email request received.");
    if (!emailAddress)
      throw new Error("No email");
    console.log("Receiver email address is " + emailAddress);
    let options = {
      auth: {
        api_key: keys.sendGridKey,
      }
    };
    let client = nodemailer.createTransport(sgTransport(options));
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: emailAddress,
      subject: 'Recreate account request.',
      text: `Dear CLUSA, \n  
                \n Below is recreate account information: \n
                \n ${note} \n  
                \n Best Regards, \n CLUSA`,
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

const programStatusUpdate = async(emailAddress, username, prevStatus, currentStatus, orgName) => {
  try {
    console.log("send email request received.");
    // if (!emailAddress)
    //   throw new Error("No email");
    // console.log("Receiver email address is " + emailAddress);
    let options = {
      auth: {
        api_key: keys.sendGridKey,
      }
    };
    let client = nodemailer.createTransport(sgTransport(options));
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: emailAddress ? emailAddress : 'grant@clusa.org',
      subject: 'Program status Update.',
      text: username ? `Dear ${username}, \n  
                \n Thank you for being interested in our Internship Grant Program. Your status have changed from ${prevStatus} to ${currentStatus}, please visit our site to check the updates. \n
                \n Thank you, \n
                \n Best Regards, \n CLUSA`
      : `Dear CLUSA, \n  
                \n The Organization ${orgName}’s status has changed from ${prevStatus} to ${currentStatus}, please check the detail information on the website. \n
                \n Thank you \n`,
    };
    await client.sendMail(mailContent);
    const message = 'Your message has been successfully sent.';
    console.log("Your message has been successfully sent.");
    return message;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

const CLUSAUploadAgreement = async(emailAddress, username) => {
  try {
    console.log("send email request received.");
    if (!emailAddress)
      throw new Error("No email");
    console.log("Receiver email address is " + emailAddress);
    let options = {
      auth: {
        api_key: keys.sendGridKey,
      }
    };
    let client = nodemailer.createTransport(sgTransport(options));
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: emailAddress,
      subject: 'CLUSA upload agreement.',
      text: `Dear ${username}: \n  
                \n Thank you for being interested in our Internship Grant Program. CLUSA had upload the Agreement, please visit our site and sign this agreement, \n
                Thank you. \n  
                \n Best Regards, \n CLUSA`,
    };
    await client.sendMail(mailContent);
    const message = 'Your message has been successfully sent.';
    console.log("Your message has been successfully sent.");
    return message;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

const CLUSAUploadAgreementToCLUSA = async(orgName) => {
  try {
    console.log("send email request received.");
    if (!emailAddress)
      throw new Error("No email");
    console.log("Receiver email address is grant@clusa.org");
    let options = {
      auth: {
        api_key: keys.sendGridKey,
      }
    };
    let client = nodemailer.createTransport(sgTransport(options));
    let mailContent = {
      from: {
        name: 'CLUSA',
        address: 'grant@clusa.org'
      },
      to: 'grant@clusa.org',
      subject: 'CLUSA upload agreement.',
      text: `Dear CLUSA: \n  
                \n The Organization ${orgName} has uploaded Agreement & Placement, please check the detail information on the website.  
                \n`,
    };
    await client.sendMail(mailContent);
    const message = 'Your message has been successfully sent.';
    console.log("Your message has been successfully sent.");
    return message;
  } catch(err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

module.exports = {
    sendEmail,
    forgetPassword,
    sendUserAddEmail,
    sendRecreateLoginEmail,
    programStatusUpdate,
    CLUSAUploadAgreement,
    CLUSAUploadAgreementToCLUSA,
};
