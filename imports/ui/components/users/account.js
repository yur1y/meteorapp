import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var'

import {Items} from '../../../../imports/api/methods/items';
import {Groups} from '../../../../imports/api/methods/groups';
import {Events} from '../../../../imports/api/methods/events';

import {ok} from '../../../../imports/startup/both/helpers';
import './account.html';
import  './profile.html';

Template.account.onCreated(function () {
    this.editUser = new ReactiveVar();
});

Template.account.helpers({
    isOwner(){
        return this.owner == Meteor.userId()
    },
    userInfo(){
        return Meteor.users.find({_id: Meteor.userId()})
    },
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
        return Groups.find({$or: [{users: Meteor.userId()}, {owner: Meteor.userId()}]})
    },
    toConfirm(){
        return Events.find({$and: [{'confirm.user': Meteor.userId()}, {'confirm.answer': false}]})
    },
    confirmed(){
        return Events.find({$and: [{'confirm.user': Meteor.userId()}, {'confirm.answer': true}]})
    },
    ordered(){
        return Items.find({'cart.ordered': true, 'cart.user': Meteor.userId()})
    }
});
Template.account.events({
    'click .editUser'(e, temp){
        e.preventDefault();
        if (temp.editUser.get() == this._id) {
            temp.editUser.set(null)
        } else {
            temp.editUser.set(this._id);
        }
    },
    'submit .update'(e){
        e.preventDefault();
        Meteor.call('users.updateWallet', this._id, Number(e.target.cash.value), Number(e.target.coupons.value));
    },
    'click .out-cart'(e){
        e.preventDefault();

        Meteor.call('items.outCart', this._id);
        ok(this.itemName + '  removed from cart');
    }
});