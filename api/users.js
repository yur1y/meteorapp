import {Meteor,} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Email,} from 'meteor/email';
import {SSR} from 'meteor/meteorhacks:ssr';

import {Groups} from './groups';

if (Meteor.isServer) {
    // 112536427740177169442 yuriy iskiv
    Accounts.onCreateUser(function (options, user) {
        options.profile ?
            user.profile = options.profile : null;

        user.services.google ?
            Meteor.call('users.onRegister', user.services.google.email) :
            user.services.vk ?
                Meteor.call('users.onRegister', user.services.vk.email)
                : null;
        user.groups = [];

        user.roles = [];
        user.wallet = {
            cash: 500, coupons: 50
        };
        user.services.google.id == 112536427740177169442 ?
            Meteor.call('users.addRole', user._id, 'admin') : null;

            Meteor.call('ok','Welcome');
        return user;
    });

    Accounts.onLogin(function () {
        Meteor.user().services.google.id == 112536427740177169442 ?
            Meteor.call('users.addRole', this.userId, 'admin') : null;
        Meteor.call('ok','wow you are signed-in');
    });
}
Meteor.methods({
    'users.Addgroup': (userId, groupId) =>
        [Meteor.users.update({_id: userId}, {$addToSet: {groups: groupId}}),
            Groups.update({_id: groupId}, {$addToSet: {users: userId}})]
    ,
    'users.Removegroup': (userId, groupId) =>
        [Meteor.users.update({_id: userId}, {$pull: {groups: groupId}}),
            Groups.update({_id: groupId}, {$pull: {users: userId}})]
    ,
    'users.onRegister': (to) => [
        SSR.compileTemplate('htmlEmail', Assets.getText('invitation.html')),

        //  email sending method
        Email.send({
            to: to,
            from: 'admin@meteorapp.com',
            subject: 'Hello from Meteor... App!',
            // text: 'Thank you for registration,meet me...Somewhere  ! .'
            html: SSR.render('htmlEmail')
        }),
        Meteor.call('ok','Check your email')
    ]
    ,
    'users.addRole': (id, role) =>
        Meteor.users.update({_id: id}, {$addToSet: {roles: role}})
    ,
    'users.removeRole': (id, role) =>
        Meteor.users.update({_id: id}, {$pull: {roles: role}})
    ,
    'users.updateWallet': (id, cash, coupons) =>
        Meteor.users.update({_id: id}, {$set: {'wallet.cash': cash, 'wallet.coupons': coupons}})
});