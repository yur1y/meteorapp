import {Meteor,} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Email} from 'meteor/email';
import {SSR} from 'meteor/meteorhacks:ssr';

import {Groups} from './groups';
import {Events} from './events';
import {Items} from './items';

if (Meteor.isServer) {
    // 112536427740177169442 yuriy iskiv
    Accounts.onCreateUser(function (options, user) {
        if (options.profile) {
            user.profile = options.profile
        }

        if (user.services.google) {
            // Meteor.call('users.onRegister', user.services.google.email);
        }
        if (user.services.vk) {
            // Meteor.call('users.onRegister', user.services.vk.email);
        }
        user.groups = [];

        user.roles = [];
        user.wallet = {
            cash: 500, coupons: 50
        };
        if (user.services.google.id === 112536427740177169442) {
            Meteor.call('users.addRole', user._id, 'admin')
        }

        Meteor.call('ok', 'Welcome');
        return user;
    });

    Accounts.onLogin(function () {
            Meteor.call('ok', 'wow you are signed-in');
        }
    );
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
    'users.send'  (to, tempName, data)  {
        SSR.compileTemplate('htmlEmail', Assets.getText(tempName));
        //undefined function compileTemplate when compile email with data  (data?) // no error on 'invitation.html',

        //  email sending method
        if (data && !data.payback) {
            let item = [];
            for (let i = 0; i < data.items.length; i++) {
                item.push(Items.findOne(data.items[i]));
                item[i].userAmount = data.amount[i]; // can't make helper() that use @index  (?)
                item[i].cost = data.cost[i];
            }
            let d = {
                item: item,
                owner: Meteor.users.findOne({_id: data.owner}),
                user: Meteor.users.findOne({_id: data.user}),
                event: Events.findOne({_id: data.event}),
                orderedCount: data.orderedCount,
                total: data.total

            };
            d.event.url = Meteor.absoluteUrl() + 'events/' + d.event.url;


            Email.send({
                to: to,
                from: 'admin@meteorapp.com',
                subject: 'Its from.. Meteor... App! wow',
                html: SSR.render('htmlEmail', d)
            })
        }
        if (data && data.payback) {


            data.user = Meteor.users.findOne({_id: data.currentUser});
            data.payback = data.currentPayback;
            Email.send({
                to: to,
                from: 'admin@meteorapp.com',
                subject: 'Its from.. Meteor... App! wow',
                html: SSR.render('htmlEmail', data)
            })
        }
        if (!data) {
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
    'users.checkout' (data){
        try {
            let owner = Meteor.users.findOne({_id: data.owner});

            if (owner.services.google) {

                if (data.payback) {
                    Meteor.call('users.send', owner.services.google.email, 'payBack.html', data);
                }
                else {
                    Meteor.call('users.send', owner.services.google.email, "toOwner.html", data);
                }

            }
            if (owner.services.vk) {
                if (data.payback) {
                    Meteor.call('users.send', owner.services.vk.email, 'payBack.html', data);
                } else {
                    Meteor.call('users.send', owner.services.vk.email, "toOwner.html", data);
                }
            }
            if (data.email == true || data.payback) {
                let user;
                if (data.payback) {
                    user = [];
                    for (let i = 0; i < data.payback.length; i++) {
                        user[i] = Meteor.users.findOne({_id: data.user[i]});
                    }
                } else {
                    user = Meteor.users.findOne({_id: data.user});
                }

                if (user.length > 1) {
                    for (let i = 0; i < user.length; i++) {
                        data.currentUser = user[i]._id;
                        data.currentPayback = data.payback[i];
                        if (user[i].services.google) {

                            Meteor.call('users.send', user[i].services.google.email, 'thank_you.html', data);
                        }
                        if (user[i].services.vk) {

                            Meteor.call('users.send', user[i].services.vk.email, 'thank_you.html', data);
                        }
                    }
                }
                else {
                    if (user.services.google) {

                        Meteor.call('users.send', user.services.google.email, 'cheque.html', data);
                    }
                    if (user.services.vk) {
                        Meteor.call('users.send', user.services.vk.email, 'cheque.html', data);
                    }
                }
            }
        } catch (e) {
        }
    }
});