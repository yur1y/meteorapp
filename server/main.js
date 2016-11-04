import {Meteor} from 'meteor/meteor';
if(Meteor.isServer) {
    Meteor.startup(() => {

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

    });
}