import {Meteor} from 'meteor/meteor';

import {Items} from '../api/items';
import {Groups} from '../api/groups';
import {Events} from '../api/events';

Meteor.publish('groups', function () {
    if(this.userId){
        return Groups.find
        ({
            $or: [{owner: this.userId}
                , {open: true},
                {users:this.userId}  ]
        });
    }
    else this.ready();
});

Meteor.publish('group', function (url) {
    if(this.userId){
        return Groups.find({$and:[
            {url: url},
            {$or:[{users:this.userId},{owner:this.userId}]}
        ]});
    }
    else this.ready();
});

Meteor.publish('users', function () {
    if(this.userId){
        return Meteor.users.find({},{fields:{'profile.name':1,'services.vk.photo_big':1,'services.google.picture':1,
            'groups':1,items:1,'status.online':1}})
    }
    else this.ready();
});

Meteor.publish('items', function (url) {
    if(this.userId){
        return Items.find({itemUrl: url});
    }
    else this.ready();
});

Meteor.publish('events',function () {
    if(this.userId){
        return Events.find({})
    }
    else this.ready();
});

Meteor.publish('event',function (url) {
    if(this.userId){
        return Events.find({url:url})
    }
    else this.ready();
});