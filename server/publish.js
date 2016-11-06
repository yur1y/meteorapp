import {Items} from '../api/items';
import {Groups} from '../api/groups';
import {Events} from '../api/events';

Meteor.publish('groups', function () {
    return Groups.find
    ({
        $or: [{owner: this.userId}
            , {open: true},
            {users:this.userId}  ]
    });
});

Meteor.publish('group', function (url) {
    return Groups.find({url: url});
});

Meteor.publish('users', function () {
    return Meteor.users.find({})
});

Meteor.publish('items', function (url) {
    return Items.find({itemUrl: url});
});

Meteor.publish('events',function () {
    return Events.find({})
});

Meteor.publish('event',function (url) {
    return Events.find({url:url})
});