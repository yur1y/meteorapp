import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {Router} from 'meteor/iron:router';
import './event-head.html';

Template.eventHead.onCreated(function () {
    setTimeout(() => {

        $('.confirmation').hide()
    }, 9000);

});

Template.eventHead.events({
    'click .yes'(e)  {
        e.preventDefault();
        console.log(this._id);
        Meteor.call('events.confirm', this._id, Meteor.userId(), true);
        $('.confirmation').css('display', 'none')
    },
    'click .no'(e){
        e.preventDefault();
        Meteor.call('events.unConfirm', this._id, Meteor.userId());
        $('.confirmation').css('display', 'none');
        setTimeout(() => {
            Router.go('/events')
        }, 3000)
    },

});