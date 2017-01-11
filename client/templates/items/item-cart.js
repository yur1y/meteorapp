import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import {throwError, userAmount} from '../../../lib/helpers';

Template.itemCart.helpers({
    wished(){
        return this.wish.indexOf(Meteor.userId()) > -1
    },
    inCart(){
        return this.cart.user.indexOf(Meteor.userId()) > -1
    },
    itemAmount(){
        return userAmount(this._id,Meteor.userId())
    }
});

Template.itemCart.events({
    'click .item-wish'(e){
        e.preventDefault();

        Meteor.call('items.wish', this._id, Meteor.userId());
    },
    'submit .in-cart'(e){
        e.preventDefault();

        e.target.amount.value <= this.amount ?
            Meteor.call('items.inCart', this._id, Meteor.userId()
                , Number(e.target.amount.value), (err, res) => {
                    res ? Meteor.call('ok', e.target.amount.value + '  ' + this.itemName + ' in the cart') : null
                }) : throwError('item amount', ' you add all available goods to cart')
    }
});