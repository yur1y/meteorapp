import {Meteor,} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Router} from 'meteor/iron:router';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, ownsDocument, throwError} from '../lib/helpers';

import {Groups} from './groups';
export const Events = new Mongo.Collection('events');

Meteor.methods({
    'events.insert': (name) =>
        noRepeat(Events, name) ? //no  copies

            [Events.insert({
                name: name,
                createdAt: moment().format('MMMM DD, YYYY HH:mm'),
                url: getSlug(name),
                owner: Meteor.userId(),
                status: 'no group added',
                groups: [],
                date: moment().add({minutes: 5}).format('MMMM DD, YYYY HH:mm')
            }), Meteor.call('ok', 'Event  ' + name + ' created')] :
            throwError('event name', 'event with the same name is already exists , try another name'),

    'events.remove': (eventId) =>
        Events.remove(eventId)
    ,
    'events.update': (id, name, date, oldName, status) =>
        noRepeat(Events, name, oldName) ?
            [Events.update({_id: id}, {
                $set: {
                    name: name,
                    url: getSlug(name),
                    date: date,
                    status: status
                }
            }), Meteor.isClient ? Router.go('/events/' + getSlug(name)) : null] :
            throwError('event name', 'event with the same name is already exists , try another name'),

    'events.group': (eventId, groupId) =>
        Events.find({_id: eventId, groups: groupId}).count() == 0 ?
            [Events.update({_id: eventId}, {
                $addToSet: {groups: groupId},
                $set: {
                    status: 'ordering',
                    date: moment().add({minutes: 5}).format('MMMM DD, YYYY HH:mm')
                }
            })] : Events.update({_id: eventId}, {
                $pull: {groups: groupId},
                $set: {status: 'no group added'}
            }),
    'events.confirm': (id, userId, answer) => {
        typeof(userId) === 'string' ? userId = [userId] : null;
        for (let i = 0; i < userId.length; i++) {

            Events.find({
                $and: [{$or: [{_id: id}, {groups: id}]}, {'confirm.user': userId[i]}]
            }).count() == 0 ?
                Events.update({$or: [{_id: id}, {groups: id}]}, {  //confirm or not group
                    $push: {
                        confirm: {
                            user: userId[i],
                            answer: answer //admin add group to event ,user not confirmed it yet
                        }
                    }, $set: {status: 'ordering'}
                }) :
                [Events.update({
                        $and: [{$or: [{_id: id}, {groups: id}]}, {'confirm.user': userId[i]}]
                    }, {
                        $set: {
                            'confirm.$.answer': answer,
                            status: 'ordering'
                        }
                    }
                )]
        }
    },
    'events.unConfirm': (id, userId) => {  //out e
        typeof (userId) === 'string' ? userId = [userId] : null;
        for (let i = 0; i < userId.length; i++) {
            Events.update({$or: [{_id: id}, {groups: id}]}, {$pull: {confirm: {user: userId[i]}}})
        }
    }, 'events.order': (id, userId) => {

        Events.update({_id: id}, {$addToSet: {ordered: userId}});
        let event = Events.findOne({_id: id});
        if (event.ordered.length == event.confirm.length) {
            //send 'thank-you' for take-part in event email
        }
        else {
            console.log(event.ordered.length + '  ' + event.confirm.length);
        }
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