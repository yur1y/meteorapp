import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var'

import {Events} from '../../../api/events';
import {Groups} from '../../../api/groups';

Template.event.onCreated(function () {
    this.left =new ReactiveVar();
    setInterval( ()=> {
        this.left.set(new Date())
    },1000)
});
Template.event.helpers({
    event(){
        return Events.find({})
    },
    isOwner(){
        return this.owner === Meteor.userId();
    },
    timeleft(){
        if(new Date(this.date)-new Date()>0)
            return 'time to event: '+   moment(Template.instance().left.get()).preciseDiff(this.date);
        else return '<p> event occured at:  '+ '<br>' + moment(this.date).format('MMMM Do YYYY, h:mm a') +'</p>';
    },
    groups(){
        return  Groups.find()

    }
});