Template.events.events({

    'submit .new-event'(e){
        event.preventDefault();


        const name = e.target.name.value;
        Meteor.call('events.insert', name);
        e.target.name.value = '';
    },
    'click .delete'(e){
        e.preventDefault();
        Events.remove({_id:this._id})
    }
});

Template.events.helpers({
    events(){
        return Events.find({});
    }
});