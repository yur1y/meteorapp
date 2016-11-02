// Template.eventEdit.helpers({
//     event(){
//         return Events.find();
//     },
//     isOwner(){
//         return this.owner == Meteor.userId()
//     }
// });
//
// Template.eventEdit.events({
//     'click .back'(e){
//         e.preventDefault();
//         Router.go('/events/' + this.url)
//     },
//     'submit .update'(event){
//         event.preventDefault();
//
//         const target = event.target;
//
//         const name = target.name.value;
//         const open = target.open.checked;
//
//         // Meteor.call('events.update', this._id, name, open);
//     },
//     'click .addGroup'(e){
//         e.preventDefault();
//         let eventId = $('p:first').text();
//         Meteor.call('events.Addgroup', this._id, eventId)
//     },
//     'click .removeGroup'(e){
//         e.preventDefault();
//         let eventId = $('p:first').text();
//         Meteor.call('events.Removegroup', this._id, eventId)
//     },
//     'click .delete'(e){
//         e.preventDefault();
//         Meteor.call('events.remove', this._id);
//     }
// });