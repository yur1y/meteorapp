import {Meteor,} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Email} from 'meteor/email';
import {SSR} from 'meteor/meteorhacks:ssr';

import {Groups} from './groups';
import {Events} from './events';
import {Items} from './items';

import {ok, userAmount, totalCost} from '../../startup/both/helpers';
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

        return user;
    });
}
if (Meteor.isClient) {
    Accounts.onLogin(function () {
            ok('wow you are signed-in');
        }
    );
}

Meteor.methods({
    'users.email'(id)  {

            let user = Meteor.users.findOne({_id: id});
            if (user.services.google) {
                return user.services.google.email;

            }
            if (user.services.vk) {
                return user.services.vk.email
            }

    },
    'users.Addgroup' (userId, groupId) {
        if (this.userId) {
            Meteor.users.update({_id: userId}, {$addToSet: {groups: groupId}});
            Groups.update({_id: groupId}, {$addToSet: {users: userId}});
            Meteor.call('events.confirm', groupId, userId, false);
        }
    }
    ,
    'users.Removegroup' (userId, groupId)  {
        if (this.userId) {
            Meteor.users.update({_id: userId}, {$pull: {groups: groupId}});
            Groups.update({_id: groupId}, {$pull: {users: userId,}});
            Meteor.call('events.unConfirm', groupId, userId);
        }
    },
    'users.onRegister' (to)  {
        Meteor.call('users.send', to, 'invitation.html');
    },
    'users.send'  (to, tempName, data)  {

            if (Meteor.isServer) {
                SSR.compileTemplate('htmlEmail', Assets.getText(tempName));

                //  email sending method
                if (data) {

                    Email.send({
                        to: to,
                        from: 'admin@meteorapp.com',
                        subject: 'Its from.. Meteor... App! wow',
                        html: SSR.render('htmlEmail', data)
                    });

                } else {
                    Email.send({
                        to: to,
                        from: 'admin@meteorapp.com',
                        subject: 'Its from.. Meteor... App! wow',
                        html: SSR.render('htmlEmail')
                    });
                }
            }
    },
    'users.addRole' (id, role)  {
        if (this.userId) {
            Meteor.users.update({_id: id}, {$addToSet: {roles: role}})
        }
    },
    'users.removeRole' (id, role)  {
        if (this.userId) {
            Meteor.users.update({_id: id}, {$pull: {roles: role}})
        }
    },
    'users.updateWallet' (id, cash, coupons)  {
        if (this.userId) {
            Meteor.users.update({_id: id}, {$set: {'wallet.cash': cash, 'wallet.coupons': coupons}});
        }
    }
    ,
    'users.order' (userId, ownerId, cash, coupons, delivery)  {
        if (this.userId) {
            let user = Meteor.users.findOne({_id: userId});
            let owner = Meteor.users.findOne({_id: ownerId});

            Meteor.call('users.updataWallet', userId, user.wallet.cash - (cash + delivery), user.wallet.coupons - coupons);        //user pay
            Meteor.call('users.updataWallet', ownerId, owner.wallet.cash + cash + delivery, user.wallet.coupons + coupons);         //owner get
        }

    },
    'users.orderReport'(data, user)
    {


        data.event = Events.findOne({_id: data.event});

        data.item = [];

        data.orderedCount = 0;
        data.total = totalCost(user);
        for (let i = 0; i < data.items.length; i++) {

            data.item.push(Items.findOne(data.items[i]));

            data.item[i].amount = (userAmount(data.items[i], user));

            data.orderedCount += userAmount(data.items[i], user);

            if (totalCost(user, data.items[i]).cash > 0) {
                data.item[i].cost = 'cost:' + data.item[i].cash + '$ *' + data.item[i].amount + '= ' + totalCost(user, data.items[i]).cash + ' $';
            }
            else {
                data.item[i].cost = 'cost:' + data.item[i].coupons + ' coup *' + data.item[i].amount + '= ' + totalCost(user, data.items[i]).coupons + ' coupons'
            }
        }

        data.sum = Number(data.delivery) + totalCost(user).cash;

        data.event.url = Meteor.absoluteUrl() + 'events/' + data.event.url;

        data.user = Meteor.users.findOne({_id: user});

        let ownerEmail = Meteor.call('users.email', data.event.owner);

        Meteor.call('users.send', ownerEmail, "toOwner.html", data);

        if (data.email == true) {

            let userEmail = Meteor.call('users.email', user);
            Meteor.call('users.send', userEmail, 'cheque.html', data);
        }
    }
});