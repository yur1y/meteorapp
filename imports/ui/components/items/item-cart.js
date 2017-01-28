import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import {throwError, userAmount, ok} from '../../../../imports/startup/both/helpers';

import './item-cart.html';

Template.itemCart.helpers({
    wished(){
        return this.wish.indexOf(Meteor.userId()) > -1
    },
    inCart(){
        return this.cart.user.indexOf(Meteor.userId()) > -1
    },
    itemAmount(){
        return userAmount(this._id, Meteor.userId())
    }
});

Template.itemCart.events({
    'click .item-wish'(e){
        e.preventDefault();

        Meteor.call('items.wish', this._id);
    },
    'submit .in-cart'(e){
        e.preventDefault();

        if (e.target.amount.value <= this.amount) {
            Meteor.call('items.inCart', this._id
                , Number(e.target.amount.value), (err, res) => {
                    if (res) ok(e.target.amount.value + '  ' + this.itemName + ' in the cart');
                });
        } else throwError('item amount', ' you add all available goods to cart')
    }
});