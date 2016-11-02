Template.event.events({});

Template.event.helpers({
    event(){
        return Events.find({})
    },
    isOwner(){
        return this.owner === Meteor.userId();
    },
    // groupOwner(){
    //     return Meteor.users.find({_id: this.owner})
    // },
    // usersIn(){
    //     return Meteor.users.find({
    //
    //         $and: [{
    //             'services.google.picture': {$exists: true}
    //         }
    //             , {groups: this._id}
    //         ]
    //     });
    // },
    // isUser(){
    //     return this.users == Meteor.userId() ||
    //         this.owner === Meteor.userId()
    // }
});