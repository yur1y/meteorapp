import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import {Items} from '../../../../imports/api/methods/items';
import {Events} from '../../../../imports/api/methods/events';

import {totalCost, parent} from '../../../../imports/startup/both/helpers';

import './order.html';

Template.order.onCreated(function () {
    this.delivery = new ReactiveVar();
});

Template.order.helpers({
    total: () => totalCost(Meteor.userId())
    ,
    canOrder ()   {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        let total = totalCost(Meteor.userId());

        return total.cash + Template.instance().delivery.get() < user.wallet.cash &&
            total.coupons < user.wallet.coupons

    },
    totalCashwithDel(){
        return totalCost(Meteor.userId()).cash + Template.instance().delivery.get();

    },
    delivery: () => Template.instance().delivery.get()
});

Template.order.events({
    'change .delivery'(e, temp){
        e.preventDefault();
        temp.delivery.set(Number(e.currentTarget.value));
    },
    'click .cancel'(e){
        e.preventDefault();
        document.querySelector('#order-dialog').close();

    },
    'click .order'(e, temp){
        e.preventDefault();
        let event = Events.findOne({_id: parent(temp).eventId.get()});

        let data = {
            items: [],
            delivery: temp.delivery.get(),
            event: parent(temp).eventId.get(),
            email: $('#check-email').is(':checked'),
            owner: Meteor.users.findOne({_id: event.owner})
        };

        Items.find({
            $and: [{'cart.user': Meteor.userId()}, //items checked to buy
                {'cart.payBy': {$in: ['coup', 'cash']}}
            ]
        }).map(doc => data.items.push(doc._id));
        // Meteor.call('events.order', data.event, Number(data.delivery));

        // Meteor.call('items.order', data.items, event.owner, data.delivery);

        Meteor.call('users.orderReport', data, Meteor.userId());
        document.querySelector('#order-dialog').close();
    }
});