import  {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Groups} from '../../../../imports/api/methods/groups';
import {ok} from '../../../../imports/startup/both/helpers';
import './groups.html';

Template.groups.events({

    'submit .new-group'(e){
        e.preventDefault();
        Meteor.call('groups.insert', e.target.name.value, function (err, res) {
            if (res) {
                ok('group ' + name + ' created');
            }
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