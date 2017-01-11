import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var'

import {Items} from '../../../api/items';
import {Groups} from '../../../api/groups';
import {Events} from '../../../api/events';

Template.account.onCreated(function () {
    this.editUser = new ReactiveVar();
});

Template.account.helpers({
    isOwner(){
        return this.owner == Meteor.userId()
    },
    userinfo: Meteor.users.find({_id: Meteor.userId()})
    ,
    isAdmin(){
        if (Meteor.userId()) {
            let user = Meteor.users.findOne(Meteor.userId, {fields: {roles: 1}});
            return user.roles.indexOf('admin') > -1;
        } else return false;
    },
    allUsers(){
        return Template.instance().editUser.get() != null ? Meteor.users.find
        ({_id: Template.instance().editUser.get()}) : Meteor.users.find({});
    },
    showUser(){
        return Template.instance().editUser.get() == this._id;
    },
    wished: Items.find({wish: Meteor.userId()}),

    inCart: Items.find({'cart.user': Meteor.userId()}),
    groups(){
        return Groups.find({users: Meteor.userId()})
    },
    toConfirm(){
        return Events.find({'confirm.user': Meteor.userId(), 'confirm.answer': false})
    },
    confirmed(){
        return Events.find({'confirm.user': Meteor.userId(), 'confirm.answer': true})
    }
});
Template.account.events({
    'click .editUser'(e, temp){
        e.preventDefault();
        temp.editUser.get() == this._id ?
            temp.editUser.set(null)
            : temp.editUser.set(this._id);
    },
    'submit .update'(e){
        e.preventDefault();
        // e.target.roles.value
        Meteor.call('users.updateWallet', this._id, Number(e.target.cash.value), Number(e.target.coupons.value));
    },
    'click .out-cart'(e){
        e.preventDefault();

        Meteor.call('items.outCart', this._id, Meteor.userId());
        Meteor.call('ok', this.itemName + '  removed from cart');
    }
});