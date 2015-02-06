var nodemailer = require('nodemailer');
var Q = require('q');
var mailconfig = require('../mailconfig');



    function sendFeedback(feedback, from) {
    var deferred = Q.defer();

    var transporter = nodemailer.createTransport({
        service: mailconfig.service,
        auth: {
            user: mailconfig.auth.user,
            pass: mailconfig.auth.pass
        }
    });
    var mailOptions = {
        from: mailconfig.auth.user, // QQ 邮箱限制， 只能发自自己， 所以这里写了自己的邮箱
        to: mailconfig.auth.user,
        subject: 'JMUI反馈, 来自-' + from,
        text: feedback,
        html: '<p>' + feedback + '</p>' + 'JMUI反馈, 来自-' + from
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            deferred.reject(error);
        }else{
            deferred.resolve(info);
        }
    });

    return deferred.promise;
}
exports.sendFeedback = sendFeedback;