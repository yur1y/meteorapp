import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var'
import {Router} from 'meteor/iron:router';

import {Events} from '../../../../imports/api/methods/events';
import {Groups} from '../../../../imports/api/methods/groups';
import {Items} from '../../../../imports/api/methods/items';
import {userAmount, totalCost} from '../../../../imports/startup/both/helpers';

import './event.html';

Template.event.onCreated(function () {
    this.left = new ReactiveVar();
    this.groupsIn = new ReactiveVar();
    this.eventId = new ReactiveVar();

    setInterval(() => {
        this.left.set(new Date()); //update reactive var every 1 sec
    }, 1000);

});

Template.event.onRendered(function () {// якщо це забрати то щоб(зразу)  'зняти' вибране радіо треба буде спочатку вибрати інше
    $('input:radio:checked').addClass('check');
});

Template.event.helpers({
    event: () => Events.find({}),
    isOwner(){
        Template.instance().groupsIn.set(this.groups);
        Template.instance().eventId.set(this._id);
        return this.owner == Meteor.userId()
    },
    timeleft(){
        if (new Date(this.date) - new Date() > 0) {
            return moment(Template.instance().left.get()).preciseDiff(moment(this.date, 'MMMM Do YYYY, HH:mm a'));
        } else return ' event occured at:  ' + this.date;
    },
    groups: () => Groups.find(),

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
    itemAmount (){
        return userAmount(this._id, Meteor.userId())
    },
    canPay(){
        let pay = {a: null, b: null, c: null};
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        let amount = userAmount(this._id, Meteor.userId());

        if (user.wallet.cash == 0 || amount * this.cash > user.wallet.cash || this.cash == 0) pay.a = 'disabled';

        if (this.coupons == 0 || amount * this.coupons > user.wallet.coupons || user.wallet.coupons == 0) pay.b = 'disabled';

        let total = totalCost(Meteor.userId());
        if (total.cash == 0 && total.coupons == 0 || total.cash > user.wallet.cash || total.coupons > user.wallet.coupons) pay.c = 'disabled';

        return pay;
    },
    check(){
        let checked = {a: null, b: null};

        const array = this.cart.find(cart => cart.user === Meteor.userId());

        if (array.payBy === 'cash') checked.a = 'checked';
        if (array.payBy === 'coup') checked.b = 'checked';

        return checked
    },
    total: () => totalCost(Meteor.userId())
    ,
    toPay(){
        const array = this.cart.find(cart => cart.user === Meteor.userId());

        if (array.payBy === 'cash') return 'cost: ' + totalCost(Meteor.userId(), this._id).cash + ' $';

        if (array.payBy === 'coup') return 'cost: ' + totalCost(Meteor.userId(), this._id).coupons + ' coupons';
    }
});
Template.event.events({
    'change .radio'(e){
        e.preventDefault();
        let radio = $('input[name="' + 'options-' + this._id + '"]:checked');
        $('input[name="' + 'options-' + this._id + '"]').removeClass('check');

        if (radio.val() == this.cash) Meteor.call('items.payBy', this._id, 'cash');
        if (radio.val() == this.coupons) Meteor.call('items.payBy', this._id, 'coup');

        $('input[name' + '="' + 'options-' + this._id + '"]:checked').addClass('check');
    },
    'click input:radio'(e){

        let radio = $('input[name="' + e.currentTarget.name + '"]:checked');
        if (radio.hasClass('check')) {
            Meteor.call('items.notPay', this._id);

            radio.removeClass('check');
            $('#option-2-' + this._id).trigger('click');//hidden

        }
    },
    'click .order-dialog'(e){
        document.querySelector('#order-dialog').showModal();
    }
});