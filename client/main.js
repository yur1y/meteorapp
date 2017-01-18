import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
Template.body.helpers({
    favicon(){
        return Meteor.absoluteUrl()+'favicon-32x32.png';
    }
})