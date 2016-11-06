import {Events} from '../../../api/events';
Template.eventEdit.helpers({
    event(){
        return Events.find();
    },
    isOwner(){

        Session.set('current_e',this._id);

        return this.owner == Meteor.userId()
    }
});

Template.eventEdit.events({
    'click .back'(e){
        e.preventDefault();
        Router.go('/events/' + this.url)
    },
    'submit .update'(e){
        e.preventDefault();

        const name = e.target.name.value;
        const date = e.target.date.value;
        // console.log(date );
        Meteor.call('events.update', this._id, name, date);
        Router.go('/events/' + this.url);
    },
    'click .addGroup'(e){
        e.preventDefault();

        Meteor.call('events.Addgroup', Session.get('current_e'), this._id)
    },
    'click .removeGroup'(e){
        e.preventDefault();

        Meteor.call('events.Removegroup', Session.get('current_e'), this._id, )
    },
    'click .remove'(e){
        e.preventDefault();

        Meteor.call('events.remove', this._id);
    }
});