import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {sAlert} from 'meteor/juliancwirko:s-alert';

import {Items} from '../../../api/items'

Template.itemsData.helpers({
    newItem: {
        name: {
            name: 'name',
            type: 'text',
            minLength: 3,
            required: true,
        },
        cash: {
            name: "cash",
            type: "number",
            min: 1,
            required: true,
        },
        amount: {
            name: "amount",
            type: "number",
            min: 1,
            required: true,
        }
    },
    files:()=>
          Items.find({cash: {$exists: true}}, {
            sort: {createdAt: 1}
        })
    ,
    isOwner() {
        return Meteor.userId() === this.owner
    },

});

Template.itemsData.events({
    'submit .new-item'(e)  {
        e.preventDefault();

        Meteor.call('items.insert', this.url, e.target.name.value,
           Number( e.target.cash.value),Number( e.target.amount.value),function (err,res) {
          err? sAlert.error(err.err,err.details): null
            });


    }

});