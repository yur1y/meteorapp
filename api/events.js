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
                confirmed:[],
                date: moment().add(5, 'm').format('YYYY-MM-DDTHH:mm')
            }), Meteor.call('ok', 'Event  ' + name + ' created')] :
            throwError('event name', 'event with the same name is already exists , try another name'),

    'events.remove': (eventId) =>
        Events.remove(eventId)
    ,
    'events.update': (id, name, date, oldName,status) =>
        noRepeat(Events, name, oldName) ?
            [Events.update({_id: id}, {
                $set: {
                    name: name,
                    url: getSlug(name),
                    date: date,
                    status:status
                }
            }), Meteor.isClient ? Router.go('/events/' + getSlug(name)) : null] :
            throwError('event name', 'event with the same name is already exists , try another name'),

    'events.group': (eventId, groupId) =>
        Events.find({_id:eventId,groups:groupId}).count()==0?
        Events.update({_id: eventId}, {
            $addToSet: {groups: groupId},
            $set: {
                status: 'ordering',
                date: moment().add(5, 'm').format('YYYY-MM-DDTHH:mm')
            }
        }): Events.update({_id: eventId}, {
            $pull: {groups: groupId},
            $set: {status: 'no group added'}
        }),
    'groups.confirm': (eventId, userId, answer) =>
      Events.find({
            _id: eventId,
            'confirm.user': userId,
        }).count() == 0 ?
           [ Events.update({_id: eventId}, {  //confirm or not group
                $push: {
                    confirm: {
                        user: userId,
                        answer: answer
                    }
                }
            }) ,] :
            Events.update({                    //user confirmed or not , but want to  change answer
                    _id: eventId,
                    'confirm.user': userId,
                }, {
                    $set: {'confirm.$.answer': answer}
                }
            ),
    'events.outEvent': (groupId, userId) =>   //out e
       Events.update({_id: groupId}, {$pull: {confirm: {user: userId}}}),

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