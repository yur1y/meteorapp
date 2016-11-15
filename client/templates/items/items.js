import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Items} from '../../../api/items'


Template.itemsData.helpers({
    newItem: {
        name: {
            name: 'name',
            type: 'text',
            minLength: 3,
            required: true,
            placeholder: "name"
        },
        price: {
            name: "price",
            type: "number",
            min: 1,
            required: true,
            placeholder: "price"
        },
        amount: {
            name: "amount",
            type: "number",
            min: 1,
            required: true,
            placeholder: "amount"
        },
        button: {
            type: 'submit',
            value: 'add article'
        }

    },
    files(){
        return Items.find({price: {$exists: true}}, {
            sort: {createdAt: 1}
        })
    },
    isOwner() {
        return Meteor.userId() === this.owner
    }
});

Template.itemsData.events({

    'submit .new-item'(e)  {
        e.preventDefault();
        let name = e.target.name.value;
        let price = e.target.price.value;
        let amount = e.target.amount.value;

        Meteor.call('items.insert', this.url, name, price, amount);  ///this.url from group template

        setTimeout(function () {
            e.target.name.value = '';
            e.target.price.value = '';
            e.target.amount.value = '';
        }, 1000)
    },
    'click [name=delete]'(e) {
        e.preventDefault();
        Meteor.call('items.remove', this._id);
    },
});