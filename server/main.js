import {Meteor} from 'meteor/meteor';
if(Meteor.isServer) {
    Meteor.startup(() => {
        // if(Meteor.users.find({groups:{$exists:false}}).count()!==0){
        //     Meteor.users.update({$set:{groups:[]}},false,true); //set ,upsert,multiply
        // }

        // MAIL url. Preferably add through hosting provider's dashboard
        process.env.MAIL_URL = "smtp://postmaster%40sandboxbc2accf126024eb084d70b8628a96bc6.mailgun.org:2d24030c13da653db429bff337a92b7f@smtp.mailgun.org:587";

        ServiceConfiguration.configurations.remove({
            service: 'google'
        });

        ServiceConfiguration.configurations.insert({
            service: 'google',
            clientId: '631069410630-6kn4d2534jtddtacj0autcp70n10cug0.apps.googleusercontent.com',
            secret: '8PXrYA-WaC5bGwbhk5aXLjb_',
            loginStyle: 'popup'
        });

        ServiceConfiguration.configurations.remove({
            service: 'vk'
        });

        ServiceConfiguration.configurations.insert({
            service: 'vk',
            appId: '5697734',      //  app id
            secret: 'v8Ex7SE9BT8mEiHRVTqx', //  app secret
            scope: ['email'], // app permissions
            loginStyle: 'popup'
        });

        // Accounts.config({
        //         sendVerificationEmail:true
        // });

//     Accounts.emailTemplates.from = 'no-reply@app.com';
//     Accounts.emailTemplates.sitename = 'My Site';
// Accounts.emailTemplates.verifyEmail.subject = (user) =>{
//     return 'Confirm your email address';
// };
// Accounts.emailTemplates.text = (user,url)=>{
//     return 'click on the following link to verify your email address'+url;
// };


    });
}
