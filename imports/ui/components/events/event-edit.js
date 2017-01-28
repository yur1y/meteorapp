import{Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {ReactiveVar} from 'meteor/reactive-var';
import {getSlug} from 'meteor/ongoworks:speakingurl';
import {datetimepicker} from 'meteor/sarasate:semantic-ui-datetimepicker';

import {Groups} from '../../../../imports/api/methods/groups';
import {Events} from '../../../../imports/api/methods/events';

import './event-edit.html';

Template.eventEdit.onCreated(function () {
    this.eventGroup = new ReactiveVar();
});

Template.eventEdit.onRendered(function () {
    this.$('.datetimepicker').datetimepicker({  //sarasate:semantic-ui-datetimepicker
        format: 'MMMM DD, YYYY HH:mm',
        minDate: moment().format('YYYY-MM-DDTHH:mm'), //datetime-local format
        icons: {
            time: "access_time",
            date: "event"
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

        Meteor.call('events.update', this._id, e.target.name.value, e.target.date.value, this.name, e.target.status.value,
            function (err, res) {
                if (res) {
                    Router.go('/events/' + getSlug(name));
                }
            });

    },
    'click .event-group'(e, temp){
        e.preventDefault();

        Meteor.call('events.group',e.currentTarget.id, this._id);
        if (temp.eventGroup.get().indexOf(this._id) == -1) {
            Meteor.call('events.confirm', e.currentTarget.id, this.users, false);
        }
        else {
            Meteor.call('events.unConfirm', e.currentTarget.id, this.users);
        } //ask users to confirm group

    },
    'click .remove'(e){
        e.preventDefault();
        Meteor.call('events.remove', this._id);
        Router.go('/events');
    }
});