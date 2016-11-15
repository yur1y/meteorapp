import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Groups} from '../../../api/groups';

Template.group.helpers({
    group(){
        return Groups.find({})
    },
    isOwner(){
        return this.owner === Meteor.userId();
    },
    groupOwner(){
        return Meteor.users.find({_id: this.owner})
    },

    usersIn(){
        return Meteor.users.find({groups: this._id});
    },
});