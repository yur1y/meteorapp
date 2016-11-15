import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';


Template.users.helpers({
    users(){
        return Meteor.users.find({});
    },
    onlineUsers(){
        return Meteor.users.find({'status.online': true})
    }
});