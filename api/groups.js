import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Router} from 'meteor/iron:router';
import {moment} from 'meteor/momentjs:moment';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, noLogo, ownsDocument, throwError} from '../lib/helpers';

export const Groups = new Mongo.Collection('groups');

Meteor.methods({
    'groups.insert': (name) =>
        noRepeat(Groups, name) ?
            [Groups.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: Meteor.userId(),
                open: false,
                users: [],
                logo: noLogo()
            }), Meteor.call('ok', 'group ' + name + ' created')] :
            throwError('group name', 'group with the same name is already exists , try another name'),

    'groups.remove': (groupId, url) => [
        Meteor.call('items.remove', url),
        Meteor.users.update({}, {$pull: {groups: groupId}}, {multi: true}), //avoid broken group-ids
        Groups.remove(groupId),
        Meteor.isClient ? Router.go('/groups') : null,
        Meteor.call('ok', 'group deleted')
    ],
    'groups.update': (id, name, open, oldName) =>
        noRepeat(Groups, name, oldName) ?
            Groups.update({_id: id}, {
                $set: {
                    name: name,
                    url: getSlug(name),
                    open: open
                }
            }) : throwError('group name', 'group with the same name is already exists , try another name'),
    'groups.newLogo': (id, url) =>
        Groups.update({_id: id}, {$set: {logo: url}})
    ,
    'groups.noLogo': (id) =>
        Groups.update({_id: id}, {$set: {logo: noLogo()}}),

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