import {Meteor} from 'meteor/meteor';

import {Items} from '../methods/items.js';
import {Groups} from '../methods/groups.js';
import {Events} from '../methods/events.js';

Meteor.publish('groups', function () {
    if (this.userId) {
        return Groups.find
        ({
            $or: [
                {owner: this.userId}
                , {open: true},
                {users: this.userId}]
        })
    } else return this.ready();
});

Meteor.publish('group', function (url) {
    if (this.userId) {
        return Groups.find({
            $and: [
                {url: url},
                {$or: [{users: this.userId}, {owner: this.userId}, {open: true}]}
            ]
        })
    } else return this.ready();
});

Meteor.publish('users', function () {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: {
                'profile.name': 1, 'services.vk.photo_big': 1, 'services.google.picture': 1,
                groups: 1, wallet: 1, roles: 1
            }
        })
    }
    else return this.ready();
});

Meteor.publish('items', function (url) {
    if (this.userId) {
        if (url) {
            return Items.find({itemUrl: url})
        } else return Items.find({})
    } else return this.ready();
});

Meteor.publish('events', function () {
    if (this.userId) {
        return Events.find({});
    }
    else return this.ready();
});

Meteor.publish('event', function (url) {
    if (this.userId) {
        return Events.find({url: url})
    } else return this.ready();
});

Meteor.publish('account', function () {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: {
                'profile.name': 1, 'services.vk.photo_big': 1, 'services.google.picture': 1,
                groups: 1, items: 1, 'status.online': 1, 'roles': 1, 'wallet.cash': 1, 'wallet.coupons': 1
            }
        })
    } else return this.ready();
});