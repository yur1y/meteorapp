import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import {ok} from '../../../../imports/startup/both/helpers';

import './item-edit.html';

Template.itemEdit.events({

    'click .remove'(e) {
        e.preventDefault();

        document.querySelector('#update-' + this._id).close();

        Meteor.call('items.remove', this._id, function (err, res) {
            if (res) {
                ok('item ' + e.target.name.value + ' deleted')
            }
        });

    },
    'click .editItem'(e){
        e.preventDefault();

        document.querySelector('#update-' + this._id).showModal();
    },
    'click .cancel'(e){
        e.preventDefault();
        document.querySelector('#update-' + this._id).close();
    },
    'submit .update'(e){
        e.preventDefault();

        Meteor.call('items.update', this._id, e.target.name.value,
            Number(e.target.cash.value), Number(e.target.amount.value), Number(e.target.coupons.value));
        document.querySelector('#update-' + this._id).close();

    }
});