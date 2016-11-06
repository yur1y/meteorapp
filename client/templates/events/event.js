import {Events} from '../../../api/events';
Template.event.helpers({
    event(){
        return Events.find({})
    },
    isOwner(){
        return this.owner === Meteor.userId();
    },
    timeleft(){
         return countdown(this.date);
    }
});