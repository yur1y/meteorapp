import {Meteor} from 'meteor/meteor';

import {Items} from '../api/items';
import {Groups} from '../api/groups';
import {Events} from '../api/events';

Meteor.publish('groups', function () {
    return this.userId ?
        Groups.find
        ({
            $or: [
                {owner: this.userId}
                , {open: true},
                {users: this.userId}]
        })
        : this.ready();
});

Meteor.publish('group', function (url) {
    return this.userId ?
        Groups.find({
            $and: [
                {url: url},
                {$or: [{users: this.userId}, {owner: this.userId}, {open: true}]}
            ]
        })
        : this.ready();
});

Meteor.publish('users', function () {
    return this.userId ?
        Meteor.users.find({}, {
            fields: {
                'profile.name': 1, 'services.vk.photo_big': 1, 'services.google.picture': 1,
                groups: 1, wallet: 1, roles: 1
            }
        })
        : this.ready();
});

Meteor.publish('items', function (url) {
    return this.userId ?
        url ?
            Items.find({itemUrl: url})
            : Items.find({})
        : this.ready();
});

Meteor.publish('events', function () {
    return this.userId ?
        Events.find({})
        : this.ready();
});

Meteor.publish('event', function (url) {
    return this.userId ?
        Events.find({url: url})
        : this.ready();
});

Meteor.publish('account', function () {
    return this.userId ?
        Meteor.users.find({}, {
            fields: {
                'profile.name': 1, 'services.vk.photo_big': 1, 'services.google.picture': 1,
                groups: 1, items: 1, 'status.online': 1, 'roles': 1, 'wallet.cash': 1, 'wallet.coupons': 1
            }
        })
        : this.ready();
});