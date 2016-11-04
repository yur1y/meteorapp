Template.eventEdit.helpers({
    event(){
        return Events.find();
    },
    isOwner(){
        return this.owner == Meteor.userId()
    },dateNow(){
        return new Date().toUTCString()
    }
});

Template.eventEdit.events({
    'click .back'(e){
        e.preventDefault();
        Router.go('/events/' + this.url)
    },
    'submit .update'(e){
        e.preventDefault();

        const name = e.target.name.value;
        const date = e.target.date.value;
        // console.log(date );
        Meteor.call('events.update', this._id, name, date);
        Router.go('/events/' + this.url);
    },
    'click .addGroup'(e){
        e.preventDefault();
        let eventId = $('p:first').text();
        Meteor.call('events.Addgroup', this._id, eventId)
    },
    'click .removeGroup'(e){
        e.preventDefault();
        let eventId = $('p:first').text();
        Meteor.call('events.Removegroup', this._id, eventId)
    },
    'click .delete'(e){
        e.preventDefault();
        Meteor.call('events.remove', this._id);
    }
});