import  {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Groups} from '../../../api/groups';

Template.groups.events({

    'submit .new-group'(e){
        e.preventDefault();
        Meteor.call('groups.insert', e.target.name.value, function (err, res) {
            return err ? err : null
        });
    }
});

Template.groups.helpers({
    newGroup(){
        return {
            name: 'name',
            type: 'text',
            required: true,
            minLenght: 3
        }
    },
    groups: () =>
        Groups.find({})
});