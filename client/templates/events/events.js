import {Template} from 'meteor/templating';

import {Events} from '../../../api/events';

Template.events.events({

    'submit .new-event'(e){
        event.preventDefault();


        Meteor.call('events.insert', e.target.name.value, () => {
        });

    },
    'click .delete'(e){
        e.preventDefault();
        Events.remove({_id: this._id})
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