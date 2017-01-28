import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {getSlug} from 'meteor/ongoworks:speakingurl';
import {ReactiveVar} from 'meteor/reactive-var';

import {Groups} from '../../../../imports/api/methods/groups';
import {noLogo, ok} from '../../../../imports/startup/both/helpers'

import './group-edit.html';

Template.groupEdit.onCreated(function () {
    this.groupId = new ReactiveVar();

});

Template.groupEdit.helpers({
    edit(){
        return {
            name: {
                name: 'name',
                value: this.name,
                type: 'text'
            }
        }
    },
    group: () => Groups.find()
    ,
    isOwner(){
        Template.instance().groupId.set(this._id);

        return this.owner == Meteor.userId()
    },
    usersIn(){
        return Meteor.users.find({groups: this._id});
    },
    allUsers(){
        return Meteor.users.find({
            $and: [{_id: {$not: this.owner}},
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


        Meteor.call('groups.update', this._id, e.target.name.value, e.target.open.checked, this.name, function (err, res) {
            if (res) Router.go('/groups/' + getSlug(e.target.name.value));
        });

    },

    'click .addUser'(e, temp){
        e.preventDefault();
        Meteor.call('users.Addgroup', this._id, temp.groupId.get());
    },

    'click .removeUser'(e, temp){
        e.preventDefault();
        Meteor.call('users.Removegroup', this._id, temp.groupId.get())
    },

    'click .remove'(e){
        e.preventDefault();
        Meteor.call('groups.remove', this._id, this.url, function (err, res) {
            if (res) {
                Router.go('/groups');
                ok('group deleted');
            }
        });

    },

    'click .newLogo'(e){
        e.preventDefault();
        Meteor.call('items.insert', this.url, this._id, this.logo);
    },

    'click .noLogo'(e){
        e.preventDefault();
        if (this.logo != noLogo()) {
            Meteor.call('items.remove', this.logo);
            Meteor.call('groups.noLogo', this._id);
            ok('no logo');
        }
    }
});