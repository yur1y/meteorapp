import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var'

import {Events} from '../../../api/events';
import {Groups} from '../../../api/groups';
import {Items} from '../../../api/items';
import {userAmount, totalCost} from '../../../lib/helpers';

Template.event.onCreated(function () {
    this.left = new ReactiveVar();
    this.groupsIn = new ReactiveVar();
    this.eventId = new ReactiveVar();
    this.delivery = new ReactiveVar();
    this.email = new ReactiveVar();
    this.itemIds = new ReactiveVar();
    this.owner = new ReactiveVar();
    setInterval(() => {
        this.left.set(new Date()); //update reactive var every 1 sec


        let ids = [];
        Items.find({
            $and: [{'cart.user': Meteor.userId()}, //items checked to buy
                {'cart.payBy': {$in: ['coup', 'cash']}}
            ]
        }).forEach(function (doc) {
            ids.push(doc._id);
        });
        this.itemIds.set(ids);

    }, 1000);

    setTimeout(() => {

        $('.confirmation').hide()
    }, 9000);

});

Template.event.onRendered(function () {
    $('input:radio:checked').addClass('check');
});

Template.event.helpers({
    event: () => Events.find({}),
    isOwner(){
        Template.instance().groupsIn.set(this.groups);
        Template.instance().eventId.set(this._id);
        Template.instance().owner.set(this.owner);
        return this.owner == Meteor.userId()
    },
    timeleft(){
        return new Date(this.date) - new Date() > 0 ?
            moment(Template.instance().left.get()).preciseDiff(moment(this.date, 'MMMM Do YYYY, HH:mm a')) :
            '<p class="tip"> event occured at:  ' + '<br>' + this.date + '</p>';
    },
    groups: Groups.find(),

    isInEvent(){
        return Template.instance().groupsIn.get().indexOf(this._id) > -1;
    },
    isConfirmed(){
        return Events.find({
            'confirm.user': Meteor.userId()
            , 'confirm.answer': true
        });
    },
    itemsToOrder(){
        return Items.find({'cart.user': Meteor.userId()})
    },
    itemAmount(){
        return userAmount(this._id, Meteor.userId());
    },
    canPay(){
        let pay = {a: null, b: null, c: null};
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        let amount = userAmount(this._id, Meteor.userId());

        user.wallet.cash == 0 ||
        amount * this.cash > user.wallet.cash || this.cash == 0 ? pay.a = 'disabled' : null;
        this.coupons == 0 || amount * this.coupons > user.wallet.coupons || user.wallet.coupons == 0 ? pay.b = 'disabled' : null;

        let total = totalCost(Meteor.userId());
        total.cash == 0 && total.coupons == 0 || total.cash +
        Template.instance().delivery.get() > user.wallet.cash ||
        total.coupons > user.wallet.coupons ? pay.c = 'disabled' : null;

        return pay;
    },
    check(){
        let checked = {a: null, b: null};

        if (Items.findOne({
                _id: this._id,
                'cart.user': Meteor.userId(),
                'cart.payBy': 'cash'
            })) {
            checked.a = 'checked';
        }
        if (Items.findOne({
                _id: this._id,
                'cart.user': Meteor.userId(),
                'cart.payBy': 'coup'
            })) {
            checked.b = 'checked';
        }
        return checked
    },
    total: () =>
        totalCost(Meteor.userId())
    ,
    canOrder: () => {
        let user = Meteor.users.findOne({_id: Meteor.userId()});

        return Number(Template.instance().delivery.get()) + totalCost(Meteor.userId()).cash < user.wallet.cash
    },
    totalCashwithDel(){
        return totalCost(Meteor.userId()).cash + Number(Template.instance().delivery.get());

    },
    delivery: () => Template.instance().delivery.get()
});
Template.event.events({
    'click .yes'(e)  {
        e.preventDefault();
        Meteor.call('events.confirm', this._id, Meteor.userId(), true);
        $('.confirmation').css('display', 'none')
    },
    'click .no'(e){
        e.preventDefault();
        Meteor.call('events.unConfirm', this._id, Meteor.userId());
        $('.confirmation').css('display', 'none');
        setTimeout(() => {
            Router.go('/events')
        }, 3000)
    },
    'click .not-now'(e){
        e.preventDefault();
        Meteor.call('events.confirm', this._id, Meteor.userId(), false);
        $('.confirmation').css('display', 'none')
    },
    'change .radio'(e){
        e.preventDefault();

        let radio = $('input[name="' + 'options-' + this._id + '"]:checked');
        $('input[name="' + 'options-' + this._id + '"]').removeClass('check');

        if (radio.val() == 0) {
            $('.toPay' + this._id).text('cost: ' + this.cash * userAmount(this._id, Meteor.userId()) + ' $');
            Meteor.call('items.payBy', this._id, Meteor.userId(), 'cash');
        }
        if (radio.val() == 1) {
            $('.toPay' + this._id).text('cost: ' + this.coupons * userAmount(this._id, Meteor.userId()) + ' coupons');
            Meteor.call('items.payBy', this._id, Meteor.userId(), 'coup');
        }
        $('input[name' + '="' + 'options-' + this._id + '"]:checked').addClass('check');

    },
    'click input:radio'(e){

        let radio = $('input[name="' + e.currentTarget.name + '"]:checked');
        if (radio.hasClass('check')) {
            Meteor.call('items.notPay', this._id, Meteor.userId());

            radio.removeClass('check');
            $('#option-2-' + this._id).trigger('click');//hidden
            $('.toPay' + this._id).text('');
        }
    },
    'click .order-dialog'(e){
        e.preventDefault();

        let dialog = document.querySelector('#order-dialog');

        dialog.showModal();
    },
    'click .cancel'(e, temp){
        e.preventDefault();
        let dialog = document.querySelector('#order-dialog');
        dialog.close();
        temp.delivery.set(null);
    },
    'change .delivery'(e, temp){
        e.preventDefault();
        temp.delivery.set(e.currentTarget.value);
    },
    'change #check-email'(e, temp){
        e.preventDefault();
        temp.email.set($('#check-email').is(':checked'));
    },
    'click .order'(e, temp){
        e.preventDefault();
        // Meteor.call('items.order', temp.itemIds.get(), Meteor.userId(), temp.owner.get());


        let d = { // - data
            items: temp.itemIds.get(),
            amounts: [],
            total: {
                coupons: (totalCost(Meteor.userId())).coupons,
                cash: (totalCost(Meteor.userId())).cash,
                del: Number(temp.delivery.get()),
                sum: (totalCost(Meteor.userId())).cash + Number(temp.delivery.get())
            },
            owner: temp.owner.get(),
            user: Meteor.userId(),
            event: temp.eventId.get(),
            orderedCount: 0,
            email: temp.email.get()
        };

        for (let i = 0; i < temp.itemIds.get().length; i++) {
            d.amounts.push(userAmount(temp.itemIds.get()[i], Meteor.userId()));
            d.orderedCount += userAmount(temp.itemIds.get()[i], Meteor.userId());
        }


        Meteor.call('users.checkout', d);
    }
});