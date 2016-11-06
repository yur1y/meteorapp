import {Groups} from '../../../api/groups';
Template.groupEdit.helpers({

    group(){

        return Groups.find()
    },
    isOwner(){
        Session.set('current_g',this._id);
        Session.set('current_url',this.url);

        return this.owner == Meteor.userId()
    },
    usersIn(){
        return Meteor.users.find({

                groups: this._id
            }
        );
    },
    allUsers(){

        return Meteor.users.find({
            $and: [{
                $or: [{'services.google.picture': {$exists: true}},
                    {'services.vk.photo_big': {$exists: true}},
                ]
            },
                {_id: {$not: this.owner}},
                {groups: {$not: this._id}}
            ]
        });
    }
});

Template.groupEdit.events({
    'click .back'(e){
        e.preventDefault();
        Router.go('/groups/' + this.url)
    },
    'submit .update'(e){
        e.preventDefault();

        const name = e.target.name.value;
        const open = e.target.open.checked;

        Meteor.call('groups.update', this._id, name, open);

        // Router.go('/groups/' + getSlug(name));
    },
    'click .addUser'(e){
        e.preventDefault();
        Meteor.call('users.Addgroup', this._id, Session.get('current_g'));
    },
    'click .removeUser'(e){
        e.preventDefault();
        Meteor.call('users.Removegroup', this._id, Session.get('current_g') )
    },
    'click .remove'(e){
        e.preventDefault();
        Meteor.call('groups.remove', this._id,this.url);
    },
    'click .newLogo'(e){
        e.preventDefault();
        Meteor.call('items.insert',Session.get('current_url'));
    },'click .noLogo'(e){
        e.preventDefault();
     Meteor.call('groups.noLogo',Session.get('current_g'));
    }
});