import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';

import {Items} from '../../api/methods/items';

export let ownsDocument = (userId, doc) => {
    return doc.owner === userId
};

export let noRepeat = (data, name, oldName) => {
    return name === oldName || data.find({name: name}).count() === 0;
};
// export let thisUrl = ()=> document.URL.split('/').pop();

export let noLogo = () => {
    return Meteor.absoluteUrl() + 'no-image.jpg';
};

export let throwError = (err, reason) => {
    if (Meteor.isServer) {           //no @#%$! in console
        throw new Meteor.Error(err, reason)
    } else sAlert.error(reason);
};


export let ok = (text) => {
    sAlert.success(text);
};


export const userAmount = (itemId, userId) => {

    const item = Items.findOne({_id: itemId, 'cart.user': userId});

    if (!item) {
        return 1;
    }
    const userCart = item.cart.find(cart => cart.user === userId);

    return userCart.amount || 1;
};

export let totalCost = (userId, itemId) => {
    let items = null;
    let cost = {cash: 0, coupons: 0};
    if (itemId) {
        items = Items.find({'cart.user': userId, _id: itemId});
    }
    else {
        items = Items.find({'cart.user': userId});
    }
    items.map((it) => {
        const item = Items.findOne({_id: it._id});
        const array = item.cart.find(cart => cart.user === userId);

        if (array.payBy === 'cash') {
            cost.cash += item.cash * array.amount;
        }
        if (array.payBy === 'coup') {
            cost.coupons += item.coupons * array.amount;
        }
    });
    return cost;
};

export let parent = (temp) => temp.view.parentView._templateInstance;// можна parent(parent()) //temp === Template.instance()