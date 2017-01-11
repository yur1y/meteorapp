import{Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {ReactiveVar} from 'meteor/reactive-var';
import {getSlug} from 'meteor/ongoworks:speakingurl';
import {datetimepicker} from 'meteor/sarasate:semantic-ui-datetimepicker';

import {Groups} from '../../../api/groups';
import {Events} from '../../../api/events';

Template.eventEdit.onCreated(function () {
    this.eventId = new ReactiveVar();
    this.eventGroup = new ReactiveVar();
});

Template.eventEdit.onRendered(function () {
    this.$('.datetimepicker').datetimepicker({
        format: 'MMMM DD, YYYY HH:mm',
        minDate: moment().format('YYYY-MM-DDTHH:mm'), //datetime-local format
        icons:{
            time: ' access_time ',
            date:' event '
        }
    });
});

Template.eventEdit.helpers({
    eventDate(){
        return {
            name: 'date',
            type: 'text',
            value: this.date,
        }
    },
    event: Events.find(),
    isOwner(){
        Template.instance().eventId.set(this._id);
        Template.instance().eventGroup.set(this.groups);
        return this.owner == Meteor.userId()
    },
    groups: Groups.find(),
    inEvent(){
        return Template.instance().eventGroup.get().indexOf(this._id) == -1
    }
});

Template.eventEdit.events({
    'click .back'(e){
        e.preventDefault();
        Router.go('/events/' + this.url)
    },
    'submit .update'(e){
        e.preventDefault();

        Meteor.call('events.update', this._id, e.target.name.value, e.target.date.value, this.name, e.target.status.value);

    },
    'click .event-group'(e, temp){
        e.preventDefault();

        Meteor.call('events.group', temp.eventId.get(), this._id);
        temp.eventGroup.get().indexOf(this._id) == -1?
            Meteor.call('events.confirm',temp.eventId.get(),this.users,false): //ask users to confirm group
            Meteor.call('events.unConfirm',temp.eventId.get(),this.users)

       },
    'click .remove'(e){
        e.preventDefault();
        Meteor.call('events.remove', this._id);
        Router.go('/events');
    }
});