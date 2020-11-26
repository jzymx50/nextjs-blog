const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587, 
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'calligraphy2digital@outlook.com',
        pass: '4+G#u&9T$V+zB36n'
    }
});

function sendEmail(emailto, code, type) {
    let title, content;
    if(type === "account"){
        title = 'Sign Up Confirmation with Calligraphy2Digital';
        content = '<b>Welcome to Calligraphy2Digital!</b><br> Your verification code for your account is <b>' + code + '</b>. Please verify within 12 hours (of signing up the account) or it will expires and your info will be deleted from the database.';
    }else{
        title = 'Password Reset at Calligraphy2Digital';
        content = 'To reset your password, verify it with code <b>' + code + "</b>. Remember the code will expired <b>once you close this popup</b>."
    }
    let mailOptions = {
        from: '"Calligraphy 2 Digital" <calligraphy2digital@outlook.com>',
        to: emailto,
        subject: title,
        text: '',
        html: content,
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            transporter.close();
            return console.log(error);
        }
        transporter.close();
        console.log('Message sent: ' + info.response);
    });
}

export {sendEmail};