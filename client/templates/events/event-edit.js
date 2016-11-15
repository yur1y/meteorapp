import{Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {ReactiveVar} from 'meteor/reactive-var';
import {getSlug} from 'meteor/ongoworks:speakingurl';

import {Events} from '../../../api/events';
import {Groups} from '../../../api/groups';

Template.eventEdit.onCreated(function () {
    this.eventId = new ReactiveVar();
});

Template.eventEdit.helpers({
    eventDate(){
        return {
            name: "date",
            type: 'datetime-local',
            value: this.date,
            min:  moment().format('YYYY-MM-DDTHH:mm') //datetime-local format
        }
    },
    event(){
        return Events.find()
    },
    isOwner(){

        Template.instance().eventId.set(this._id);

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
        Meteor.call('events.update', this._id, name, date,this.name);
        Router.go('/events/' + getSlug(name));
    },
    'click .addGroup'(e, temp){
        e.preventDefault();

        Meteor.call('events.Addgroup', temp.eventId.get(), this._id)
    },
    'click .removeGroup'(e, temp){
        e.preventDefault();
        Router.go('/events');
        Meteor.call('events.Removegroup', temp.eventId.get(), this._id,)

    },
    'click .remove'(e){
        e.preventDefault();
        Meteor.call('events.remove', this._id);
    }
});