import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Groups} from '../../../../imports/api/methods/groups';
import './group.html';

Template.group.helpers({
    group: () => Groups.find({})
    ,
    isOwner(){
        return this.owner == Meteor.userId();
    },
    groupOwner(){
        return Meteor.users.find({_id: this.owner})
    },
    usersIn(){
        return Meteor.users.find({groups: this._id});
    },
});