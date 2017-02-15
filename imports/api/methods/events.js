import {Meteor,} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {noRepeat, ownsDocument, throwError} from '../../startup/both/helpers';

export const Events = new Mongo.Collection('events');


Events.allow({
    insert (userId, doc) {
        return userId;
    },
    update (userId, doc) {
        return ownsDocument(userId, doc);
    },
    remove (userId, doc) {
        return ownsDocument(userId, doc);
    }
});

Meteor.methods({
    'events.insert'(name) {

        if (this.userId) {
            if (noRepeat(Events, name)) { //no  copies

                Events.insert({
                    name: name,
                    createdAt: moment().format('MMMM DD, YYYY HH:mm'),
                    url: getSlug(name),
                    owner: this.userId,
                    status: 'no group added',
                    groups: [],
                    date: moment().add({minutes: 5}).format('MMMM DD, YYYY HH:mm')
                })
            } else {
                throwError('event name', 'event with the same name is already exists , try another name')
            }
        }
    },

    'events.remove' (eventId) {
        let event = Events.findOne({_id: eventId});
        if (ownsDocument(this.userId, event)) {
            Events.remove({_id: eventId})
        }
    }
    ,
    'events.update' (id, name, date, oldName, status)  {
        let event = Events.findOne({_id: id});
        if (ownsDocument(this.userId, event)) {
            if (noRepeat(Events, name, oldName)) {
                Events.update({_id: id}, {
                    $set: {
                        name: name,
                        url: getSlug(name),
                        date: date,
                        status: status
                    }
                });
            } else {
                throwError('event name', 'event with the same name is already exists , try another name');
            }
        }
    }
    ,

    'events.group' (eventId, groupId) {
        let event = Events.findOne({_id: eventId});

        if (ownsDocument(this.userId, event)) {
            if (Events.find({_id: eventId, groups: groupId}).count() == 0) {
                Events.update({_id: eventId}, {
                    $addToSet: {groups: groupId},
                    $set: {
                        status: 'ordering',
                        date: moment().add({minutes: 5}).format('MMMM DD, YYYY HH:mm')
                    }
                });
            } else {
                Events.update({_id: eventId}, {
                    $pull: {groups: groupId},
                    $set: {status: 'no group added'}
                })
            }
        }
    }
    ,
    'events.confirm' (id, userId, answer)  {
        if (this.userId) {
            typeof(userId) === 'string' ? userId = [userId] : null;

            for (let i = 0; i < userId.length; i++) {

                if (Events.find({
                        $and: [{$or: [{_id: id}, {groups: id}]}, {'confirm.user': userId[i]}]
                    }).count() == 0) {
                    Events.update({$or: [{_id: id}, {groups: id}]}, {  //confirm or not group
                        $push: {
                            confirm: {
                                user: userId[i],
                                answer: answer //admin add group to event ,user not confirmed it yet
                            }
                        }, $set: {status: 'ordering'}
                    })
                } else {
                    Events.update({
                            $and: [{$or: [{_id: id}, {groups: id}]}, {'confirm.user': userId[i]}]
                        }, {
                            $set: {
                                'confirm.$.answer': answer,
                                status: 'ordering'
                            }
                        }
                    )
                }
            }
        }
    },
    'events.unConfirm': (id, userId) => {  //out e
        if (this.userId) {
            typeof (userId) === 'string' ? userId = [userId] : null;

            for (let i = 0; i < userId.length; i++) {
                Events.update({$or: [{_id: id}, {groups: id}]}, {$pull: {confirm: {user: userId[i]}}})
            }
        }
    },
    'events.order'(id, delivery)  {
        if (this.userId) {
            Events.update({_id: id}, {$push: {'ordered.user': this.userId, 'ordered.delivery': delivery}});

            let event = Events.findOne({_id: id});
            if (event.ordered.length == event.confirm.length) {

                //send 'thank-you' for take-part in event email //all user order something... so... payback them delivery !
                Events.update({_id: id}, {$set: {status: 'delivered'}});
                let data = {

                    owner: Meteor.users.findOne({_id: event.owner}),
                    name: event.name,
                    url: Meteor.absoluteUrl() + 'events/' + event.url
                };
                for (let i = 0; i < event.ordered.length; i++) {
                    Meteor.call('users.order', event.owner, event.ordered[i].user, 0, 0, -event.ordered[i].delivery); //навпаки бо віддаєм доставку длл

                    data.user = Meteor.users.findOne({_id: event.ordered[i].user});
                    data.payback = event.ordered[i].delivery;

                    let userEmail = Meteor.call('users.email', event.ordered[i].user);

                    Meteor.call('users.send', userEmail, 'thank_you.html', data);
                }
            }
        }
    }
});
