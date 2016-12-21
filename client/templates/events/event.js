import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var'

import {Events} from '../../../api/events';
import {Groups} from '../../../api/groups';

Template.event.onCreated(function () {
    this.left = new ReactiveVar();
    setInterval(() => {
        this.left.set(new Date()); //update reactive var every 1 sec
    }, 1000)
});
Template.event.helpers({
    event: () => Events.find({})
    ,
    isOwner(){
        return this.owner == Meteor.userId()
    },
    timeleft(){
        return new Date(this.date) - new Date() > 0 ?
            moment(Template.instance().left.get()).preciseDiff(this.date) :
        '<p> event occured at:  ' + '<br>' + moment(this.date).format('MMMM Do YYYY, h:mm a') + '</p>';
    },
    groupsIn(){
        return Groups.find({_id:{$all:this.groups}})
    }
});