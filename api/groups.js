import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Router} from 'meteor/iron:router';
import {moment} from 'meteor/momentjs:moment';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, noLogo, ownsDocument} from '../lib/helpers';

export const Groups = new Mongo.Collection('groups');

Meteor.methods({
    'groups.insert'(name){
        if (noRepeat(Groups, name)) {
            Groups.insert({
                name:  name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                open: false,
                // items: [],
                users: [],
                logo: noLogo()
            });
        }
    },
    'groups.remove'(groupId, url){
        Meteor.call('items.remove', url);
        Meteor.users.update({}, {$pull: {groups: groupId}}, {multi: true}); //avoid broken group-ids
        Groups.remove(groupId);
    },
    'groups.update'(id, name, open,oldName){
        if (noRepeat(Groups, name,oldName)) {
            Groups.update({_id: id}, {
                $set: {
                    name:   name,
                    url: getSlug(name),
                    open: open
                }
            });
        }
    },
    'groups.newLogo'(id, url){
        Groups.update({_id: id}, {$set: {logo: url}})
    },
    'groups.noLogo'(id){
        Groups.update({_id: id}, {$set: {logo: noLogo()}});
    }
});

Groups.allow({
    insert () {
        return Meteor.userId();
    },
    update (userId, doc) {
        return ownsDocument(userId, doc);
    },
    remove (userId, doc) {
        return ownsDocument(userId, doc);
    }
});