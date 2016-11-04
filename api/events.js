Events = new Mongo.Collection('events');

Meteor.methods({
    'events.insert'(name){

        if (noRepeat(Events,name)) //no  copies
        {
            Events.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                groups:[],
            });

        } else {
            throw new Meteor.Error('group already exist');
        }
    },
    'events.remove'(eventId){

        Events.remove(eventId);
        Router.go('/events');
    },
    'events.update'(id, name,date){

        Events.update({_id: id}, {
            $set: {
                name: name,
                url: getSlug(name),
                date:date
            }
        });

    },
    'events.Addgroup'(eventId,groupId){
       return Events.update({_id: eventId}, {$addToSet: {groups: groupId}})
    },

    'events.Removegroup'(eventId,groupId){
        return  Events.update({_id: eventId}, {$pull: {groups: groupId}})
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