import {Meteor,} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Router} from 'meteor/iron:router';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, ownsDocument, throwError} from '../lib/helpers';

export const Events = new Mongo.Collection('events');

Meteor.methods({
    'events.insert': (name) =>
        noRepeat(Events, name) ? //no  copies

            [Events.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                status: 'no group added',
                groups: [],
                date: moment().add(5, 'm').format('YYYY-MM-DDTHH:mm')
            }),Meteor.call('ok','Event  '+ name+' created' )] :
            throwError('event name', 'event with the same name is already exists , try another name')
    ,
    'events.remove': (eventId) =>
        Events.remove(eventId)
    ,
    'events.update': (id, name, date, oldName) =>
        noRepeat(Events, name, oldName) ?
            Events.update({_id: id}, {
                $set: {
                    name: name,
                    url: getSlug(name),
                    date: date
                }
            }) :
            throwError('event name', 'event with the same name is already exists , try another name'),


    'events.Addgroup': (eventId, groupId) =>
        Events.update({_id: eventId}, {
            $addToSet: {groups: groupId},
            $set: {status: 'ordering'}
        }),

    'events.Removegroup': (eventId, groupId) =>

        Events.update({_id: eventId}, {
            $pull: {groups: groupId},
            $set: {status: 'no group added'}
        })

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