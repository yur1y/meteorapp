import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';

import {Items} from '../api/items';

export let ownsDocument = (userId, doc) => doc.owner == userId;

export let noRepeat = (data, name, oldName) =>
data.find({name: name}).count() === 0 || name === oldName;
// export let thisUrl = ()=> document.URL.split('/').pop();

export let noLogo = () => Meteor.absoluteUrl() + 'no-image.jpg';

export let throwError = (err, reason) => {
    if (Meteor.isServer) {           //no @#%$! in console
        throw new Meteor.Error(err, reason)
    } else sAlert.error(reason);
};

Meteor.methods({
    'ok'(text){
        Meteor.isClient ?
            sAlert.success(text) : null
    }

});


export let userAmount = (itemId, userId) => {

    let item = Items.findOne({_id: itemId, 'cart.user': userId});
    let amount = '';
    item ?
        item.cart.filter(function (cart) {
                cart.user == userId ?
                    amount = Number(cart.amount) : null
            }
        ) : amount = 1;

    return amount < 1 ? 1 : amount;
};

export let totalCost = (userId, itemId) => {
    let cost = {cash: 0, coupons: 0};

    let count = (doc) => {

        let item = Items.findOne({_id: doc._id});
        item ?
            item.cart.filter((cart) => {
                    if (cart.user == userId) {

                        if (cart.payBy == 'cash') {
                            cost.cash += doc.cash * cart.amount
                        }
                        if (cart.payBy == 'coup') {
                            cost.coupons += doc.coupons * cart.amount
                        }
                    }
                }
            ) : null;
    };
    itemId ? Items.find({_id: itemId}).forEach((doc) => {
            count(doc);
        }) :
        Items.find({'cart.user': userId}).forEach((doc) => {
            count(doc)
        });

    return cost
};