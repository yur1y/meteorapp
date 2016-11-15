import  {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Groups} from '../../../api/groups';

Template.groups.events({

    'submit .new-group'(e){
        e.preventDefault();


        const name = e.target.name.value;
        Meteor.call('groups.insert', name, function (err, res) {
            // if(err){console.log(err.message+ ' '+err.reason)}
        });
        e.target.name.value = '';
    }
});

Template.groups.helpers({
    newGroup(){
        return {
            name: {
                name: 'name',
                type: 'text',
                placeholder: 'new group name'
            },
            button: {
                type: 'submit',
                value: 'Add group'
            }
        }
    },
    groups(){
        return Groups.find({})
    }
});