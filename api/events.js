import {Meteor,} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Router} from 'meteor/iron:router';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, ownsDocument} from '../lib/helpers';

export const Events = new Mongo.Collection('events');

Meteor.methods({
    'events.insert'(name){
        if (noRepeat(Events, name)) //no  copies
        {
            Events.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                groups: [],
                date: moment().add(5, 'm').format('YYYY-MM-DDTHH:mm')
            });
        }
    },
    'events.remove'(eventId){
        Events.remove(eventId);
    },
    'events.update'(id, name, date, oldName){
        if (noRepeat(Events, name, oldName)) {
            Events.update({_id: id}, {
                $set: {
                    name: name,
                    url: getSlug(name),
                    date: date
                }
            });
        }
    },
    'events.Addgroup'(eventId, groupId){
        return Events.update({_id: eventId}, {$addToSet: {groups: groupId}})
    },
    'events.Removegroup'(eventId, groupId){
        return Events.update({_id: eventId}, {$pull: {groups: groupId}})
    }
});

Events.allow({
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