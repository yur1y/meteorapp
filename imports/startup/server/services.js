import {ServiceConfiguration}  from 'meteor/service-configuration';
import {Meteor} from 'meteor/meteor';


// MAIL url. Preferably add through hosting provider's dashboard
    process.env.MAIL_URL = Meteor.settings.private.email_url;

    ServiceConfiguration.configurations.remove({
        service: 'google'
    });

    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings.private.service.google.id,
        secret: Meteor.settings.private.service.google.secret,
        loginStyle: 'popup'
    });

    ServiceConfiguration.configurations.remove({
        service: 'vk'
    });

    ServiceConfiguration.configurations.insert({
        service: 'vk',
        appId: Meteor.settings.private.service.vk.id,      //  app id
        secret: Meteor.settings.private.service.vk.secret, //  app secret
        scope: ['email'], // app permissions
        loginStyle: 'popup'
    });

