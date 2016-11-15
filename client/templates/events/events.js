import {Template} from 'meteor/templating';

import {Events} from '../../../api/events';

Template.events.events({

    'submit .new-event'(e){
        event.preventDefault();

        const name = e.target.name.value;
        Meteor.call('events.insert', name);
        e.target.name.value = '';
    },
    'click .delete'(e){
        e.preventDefault();
        Events.remove({_id: this._id})
    }
});

Template.events.helpers({
    newEvent(){
        return {
            name: {
                name: 'name',
                type: 'text',
                placeholder: 'new event name'
            },
            button: {
                type: 'submit',
                value: 'Add event'
            }
        }
    },
    events(){
        return Events.find({})
    }
});