import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {moment} from 'meteor/momentjs:moment';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, noLogo, ownsDocument, throwError} from '../../startup/both/helpers';

export const Groups = new Mongo.Collection('groups');

Meteor.methods({
    'groups.insert'(name)  {
        if (this.userId) {
            if (noRepeat(Groups, name)) {
                Groups.insert({
                    name: name,
                    createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                    url: getSlug(name),
                    owner: this.userId,
                    open: false,
                    users: [],
                    logo: noLogo()
                })
            }
            else {
                throwError('group name', 'group with the same name is already exists , try another name')
            }
        }
    },
    'groups.remove'(groupId, url) {
        let group = Groups.findOne({_id: groupId});
        if ( ownsDocument(this.userId, group)) {
            Meteor.call('items.remove', url);
            Meteor.users.update({}, {$pull: {groups: groupId}}, {multi: true}); //avoid broken group-ids
            Groups.remove(groupId);
        }
    },
    'groups.update' (id, name, open, oldName) {
        let group = Groups.findOne({_id: id});
        if (ownsDocument(this.userId, group)) {
            if (noRepeat(Groups, name, oldName)) {
                Groups.update({_id: id}, {
                    $set: {
                        name: name,
                        url: getSlug(name),
                        open: open
                    }
                });
            } else {
                throwError('group name', 'group with the same name is already exists , try another name');
            }
        }
    }
    ,
    'groups.newLogo' (id, url)  {
        let group = Groups.findOne({_id: id});
        if ( ownsDocument(this.userId, group)) {
            Groups.update({_id: id}, {$set: {logo: url}})
        }
    },
    'groups.noLogo' (id)  {
        let group = Groups.findOne({_id: id});
        if (  ownsDocument(this.userId, group)) {
            Groups.update({_id: id}, {$set: {logo: noLogo()}})
        }
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