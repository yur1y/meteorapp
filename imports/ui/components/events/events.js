import {Template} from 'meteor/templating';

import {Events} from '../../../../imports/api/methods/events';

import {ok} from '../../../../imports/startup/both/helpers';

import './events.html';

Template.events.events({

    'submit .new-event'(e){
        event.preventDefault();


        Meteor.call('events.insert', e.target.name.value, (err, res) => {
            if (res) {
                ok('Event  ' + e.target.name.value + ' created')
            }
        });

    }
});

Template.events.helpers({
    newEvent(){
        return {
            name: 'name',
            type: 'text',
            required: true,
            minLength: 3
        }
    },
    events: () =>
        Events.find({$or: [{owner: Meteor.userId()}, {'confirm.user': Meteor.userId()}]})
});