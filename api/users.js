import {Meteor,} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Email,} from 'meteor/email';
import {SSR, compileTemplate, Template} from 'meteor/meteorhacks:ssr';

import {Groups} from './groups';
import {Events} from './events';
import {Items} from './items';

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
            cash: 500, coupons: 50,
            cashUsed: 0, couponsUsed: 0
        };
        user.services.google.id == 112536427740177169442 ?
            Meteor.call('users.addRole', user._id, 'admin') : null;

        Meteor.call('ok', 'Welcome');
        return user;
    });

    Accounts.onLogin(function () {
        Meteor.user().services.google.id == 112536427740177169442 ?
            Meteor.call('users.addRole', this.userId, 'admin') : null;
        Meteor.call('ok', 'wow you are signed-in');
    });
}
Meteor.methods({
    'users.Addgroup': (userId, groupId) =>
        [Meteor.users.update({_id: userId}, {$addToSet: {groups: groupId}}),
            Groups.update({_id: groupId}, {$addToSet: {users: userId}}),
            Meteor.call('events.confirm', groupId, userId, false)]
    ,
    'users.Removegroup': (userId, groupId) =>
        [Meteor.users.update({_id: userId}, {$pull: {groups: groupId}}),
            Groups.update({_id: groupId}, {$pull: {users: userId,}}),
            Meteor.call('events.unConfirm', groupId, userId)
        ],
    'users.onRegister': (to) => {
        Meteor.call('users.send', to, 'invitation.html');
    },
    'users.send': (to, tempName, data) => {

        SSR.compileTemplate('htmlEmail', Assets.getText(tempName));


        //  email sending method
        if (data) {
            let d={items:Items.find({_id: data.items}),
                owner:Meteor.users.findOne({_id: data.owner}),
                user:Meteor.users.findOne({_id: data.user}),
                event: Events.findOne({_id: data.event}),
                orderedCount:data.orderedCount
            };
            // data.items = .fetch();
            // data.owner = ;
            // data.user = ;
            // data.event =;


            Email.send({
                to: to,
                from: 'admin@meteorapp.com',
                subject: 'Its from.. Meteor... App! wow',
                html: SSR.render('htmlEmail', d)
            })
        } else {
            Email.send({
                to: to,
                from: 'admin@meteorapp.com',
                subject: 'Its from.. Meteor... App! wow',
                html: SSR.render('htmlEmail')
            });
        }
        Meteor.call('ok', 'Check your email')
    },
    'users.addRole': (id, role) =>
        Meteor.users.update({_id: id}, {$addToSet: {roles: role}})
    ,
    'users.removeRole': (id, role) =>
        Meteor.users.update({_id: id}, {$pull: {roles: role}})
    ,
    'users.updateWallet': (id, cash, coupons) =>
        Meteor.users.update({_id: id}, {$set: {'wallet.cash': cash, 'wallet.coupons': coupons}})
    ,
    'users.order': (id1, id2, cash, coupons) => {
        Meteor.users.update({_id: id1}, {
            $inc: {
                'wallet.cash': -cash,
                'wallet.coupons': -coupons
            }
        });
        Meteor.users.update({_id: id2}, {
            $inc: {
                'wallet.cash': cash,
                'wallet.coupons': coupons
            }
        })
    },
    'users.checkout': (data) => {
        // data.user =  data.user});
        // data.owner  data.owner});
        // data.event =data.event});
        let owner = Meteor.users.findOne({_id: data.owner});
        if (owner.services.google) {

            Meteor.call('users.send', owner.services.google.email, "toOwner.html", data);
        }
        else {
            Meteor.call('users.send', owner.services.vk.email, "toOwner.html", data);
        }


        // if (data.user) {
        //     if (user.services.google) {
        //         Meteor.call('users.send', user.services.google.email,'cheque',data),
        // Meteor.call('users.send', user.services.google.email, 'cheque', data);
        // }
        // if (user.services.vk) {
        //     Meteor.call('users.send', user.services.vk.email, 'cheque', data);
        // }
        // }

        // data.items;
        // data.amounts;
        // data.total;
        // data.owner;
        // data.user;
        // data.event;


    }
});